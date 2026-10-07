import "dotenv/config";

import type { TelegramNotification } from "../types/telegramNotification";
import type { CourseEnrollment } from "./courseEnrollment.service";
import type { CustomRoastingRequest } from "./customRoasting.service";
import type { Order } from "./order.service";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

type TelegramSendMessageResponse = {
  ok: boolean;
  description?: string;
};

type OrderNotificationData = Pick<Order, "id" | "customer" | "items" | "total">;

type CourseEnrollmentNotificationData = Pick<
  CourseEnrollment,
  "id" | "course" | "customer"
>;

type CustomRoastingNotificationData = Pick<
  CustomRoastingRequest,
  "id" | "customer" | "coffee" | "message"
>;

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const recipientIds = (process.env.TELEGRAM_RECIPIENT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  if (recipientIds.length === 0) {
    throw new Error("TELEGRAM_RECIPIENT_IDS is not configured.");
  }

  return { botToken, recipientIds };
}

// ----------------------------------------------------------------------
// SEND MESSAGE
// ----------------------------------------------------------------------

async function sendTelegramMessageToChat(
  botToken: string,
  chatId: string,
  text: string,
): Promise<void> {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    },
  );

  const data = (await response.json()) as TelegramSendMessageResponse;

  if (!response.ok || !data.ok) {
    throw new Error(
      data.description ??
        `Telegram API request failed with status ${response.status}.`,
    );
  }
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const { botToken, recipientIds } = getTelegramConfig();
  const errors: string[] = [];

  for (const chatId of recipientIds) {
    try {
      await sendTelegramMessageToChat(botToken, chatId, text);
    } catch (error) {
      errors.push(`${chatId}: ${errorMessage(error)}`);
    }
  }

  if (errors.length === 0) {
    return;
  }

  const error = new Error(errors.join("; "));
  const everyErrorIsPermanent = errors.every((item) =>
    isPermanentTelegramError(item),
  );

  // A recipient who has not pressed Start should not make us send the
  // same order again to everyone who already received it.
  if (everyErrorIsPermanent && errors.length < recipientIds.length) {
    console.error("Some Telegram recipients were skipped:", error.message);
    return;
  }

  if (everyErrorIsPermanent) {
    error.name = "PermanentTelegramError";
  }

  throw error;
}

// ----------------------------------------------------------------------
// ORDER NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendOrderNotification(
  order: OrderNotificationData,
): Promise<void> {
  const itemsText = order.items
    .map((item) => {
      const itemTotal = item.price * item.quantity;

      return [
        `• ${item.name} × ${item.quantity}`,
        `  ${item.roast} · ${item.weight}`,
        `  ₴${itemTotal}`,
      ].join("\n");
    })
    .join("\n\n");

  const comment = order.customer.comment.trim();

  const message = [
    "🛒 НОВЕ ЗАМОВЛЕННЯ",
    "",
    `Замовлення: #${order.id}`,
    "",
    "Клієнт:",
    `Ім'я: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `Email: ${order.customer.email}`,
    "",
    "Доставка:",
    `Місто: ${order.customer.city}`,
    `Адреса: ${order.customer.address}`,
    "",
    "Товари:",
    itemsText,
    "",
    `💰 Разом: ₴${order.total}`,
    ...(comment ? ["", "Коментар:", comment] : []),
  ].join("\n");

  await sendTelegramMessage(message);
}

// ----------------------------------------------------------------------
// COURSE ENROLLMENT NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendCourseEnrollmentNotification(
  enrollment: CourseEnrollmentNotificationData,
): Promise<void> {
  const message = [
    "🎓 НОВА ЗАПИС НА КУРС",
    "",
    `Заявка: #${enrollment.id}`,
    "",
    "Курс:",
    `${enrollment.course.title}`,
    `Тривалість: ${enrollment.course.duration}`,
    `Ціна: ₴${enrollment.course.price}`,
    "",
    "Клієнт:",
    `Ім'я: ${enrollment.customer.name}`,
    `Телефон: ${enrollment.customer.phone}`,
    `Email: ${enrollment.customer.email}`,
  ].join("\n");

  await sendTelegramMessage(message);
}

// ----------------------------------------------------------------------
// CUSTOM ROASTING NOTIFICATIONS
// ----------------------------------------------------------------------

export async function sendCustomRoastingNotification(
  request: CustomRoastingNotificationData,
): Promise<void> {
  const extraMessage = request.message.trim();

  const message = [
    "🔥 НОВА ЗАЯВКА НА ОБСМАЖУВАННЯ",
    "",
    `Заявка: #${request.id}`,
    "",
    "Клієнт:",
    `Ім'я: ${request.customer.name}`,
    `Телефон: ${request.customer.phone}`,
    `Email: ${request.customer.email}`,
    "",
    "Параметри:",
    `Походження: ${request.coffee.origin}`,
    `Кількість: ${request.coffee.quantity}`,
    `Обсмажування: ${request.coffee.roast}`,
    `Призначення: ${request.coffee.purpose}`,
    ...(extraMessage ? ["", "Коментар:", extraMessage] : []),
  ].join("\n");

  await sendTelegramMessage(message);
}

// ----------------------------------------------------------------------
// DELIVERY
// ----------------------------------------------------------------------

const MAX_ATTEMPTS = 3;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown Telegram error.";
}

function isPermanentTelegramError(message: string): boolean {
  return (
    message.includes("chat not found") ||
    message.includes("bot was blocked by the user") ||
    message.includes("user is deactivated")
  );
}

function isConfigError(error: unknown): boolean {
  return (
    errorMessage(error).includes("is not configured") ||
    (error instanceof Error && error.name === "PermanentTelegramError")
  );
}

export async function deliverTelegramNotification(
  send: () => Promise<void>,
): Promise<TelegramNotification> {
  let lastError = "Unknown Telegram error.";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await send();

      return {
        status: "sent",
        attempts: attempt,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      lastError = errorMessage(error);
      console.error(`Telegram notification attempt ${attempt} failed:`, error);

      if (isConfigError(error) || attempt === MAX_ATTEMPTS) {
        return {
          status: "failed",
          attempts: attempt,
          error: lastError,
        };
      }

      await delay(1000 * attempt);
    }
  }

  return {
    status: "failed",
    attempts: MAX_ATTEMPTS,
    error: lastError,
  };
}

export function deliverTelegramNotificationInBackground(
  send: () => Promise<void>,
  save: (notification: TelegramNotification) => Promise<unknown>,
): void {
  void (async () => {
    const notification = await deliverTelegramNotification(send);
    await save(notification);
  })().catch((error: unknown) => {
    console.error("Failed to store Telegram notification status:", error);
  });
}
