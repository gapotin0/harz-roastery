import type { Request, Response } from "express";

import {
  deliverTelegramNotification,
  deliverTelegramNotificationInBackground,
  sendOrderNotification,
} from "../services/telegram.service";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  saveOrderNotification,
  updateOrderStatus,
  type CreateOrderInput,
  type OrderCustomer,
  type OrderStatus,
} from "../services/order.service";
import { contactError } from "../utils/contact";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCustomer(value: unknown): value is OrderCustomer {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const customer = value as Partial<OrderCustomer>;

  return (
    isNonEmptyString(customer.name) &&
    isNonEmptyString(customer.phone) &&
    isNonEmptyString(customer.email) &&
    isNonEmptyString(customer.city) &&
    isNonEmptyString(customer.address) &&
    typeof customer.comment === "string"
  );
}

function isCreateOrderInput(value: unknown): value is CreateOrderInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Partial<CreateOrderInput>;

  if (
    !isCustomer(data.customer) ||
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    return false;
  }

  return data.items.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof item.productId === "number" &&
      Number.isInteger(item.productId) &&
      item.productId > 0 &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 100,
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllOrders(_request: Request, response: Response) {
  try {
    const orders = await getOrders();
    response.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    response.status(500).json({ message: "Failed to load orders." });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addOrder(request: Request, response: Response) {
  if (!isCreateOrderInput(request.body)) {
    response.status(400).json({ message: "Invalid order data." });
    return;
  }

  try {
    const input = request.body;

    const customer = {
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      email: input.customer.email.trim(),
      city: input.customer.city.trim(),
      address: input.customer.address.trim(),
      comment: input.customer.comment.trim(),
    };
    const invalidContact = contactError(customer.email, customer.phone);

    if (invalidContact) {
      response.status(400).json({ message: invalidContact });
      return;
    }

    const order = await createOrder({
      customer,
      items: input.items,
    });

    deliverTelegramNotificationInBackground(
      () => sendOrderNotification(order),
      (notification) => saveOrderNotification(order.id, notification),
    );

    response.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    response.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to create order.",
    });
  }
}

// ----------------------------------------------------------------------
// STATUS
// ----------------------------------------------------------------------

export async function resendOrderToTelegram(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid order id." });
    return;
  }

  try {
    const order = await getOrder(id);
    const notification = await deliverTelegramNotification(() =>
      sendOrderNotification(order),
    );
    const updatedOrder = await saveOrderNotification(id, notification);

    response.json(updatedOrder);
  } catch (error) {
    console.error("Resend order notification error:", error);
    response.status(500).json({
      message: "Failed to send the order to Telegram.",
    });
  }
}

export async function changeOrderStatus(request: Request, response: Response) {
  const id = Number(request.params.id);
  const { status } = request.body as { status?: unknown };

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid order id." });
    return;
  }

  if (
    typeof status !== "string" ||
    !ORDER_STATUSES.includes(status as OrderStatus)
  ) {
    response.status(400).json({ message: "Invalid order status." });
    return;
  }

  try {
    const order = await updateOrderStatus(id, status as OrderStatus);
    response.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    response.status(500).json({ message: "Failed to update order." });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeOrder(request: Request, response: Response) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({ message: "Invalid order id." });
    return;
  }

  try {
    await deleteOrder(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete order error:", error);
    response.status(500).json({ message: "Failed to delete order." });
  }
}
