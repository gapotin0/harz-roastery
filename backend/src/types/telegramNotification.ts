export type TelegramNotificationStatus = "pending" | "sent" | "failed";

export type TelegramNotification = {
  status: TelegramNotificationStatus;
  attempts: number;
  sentAt?: string;
  error?: string;
};

export const pendingTelegramNotification = (): TelegramNotification => ({
  status: "pending",
  attempts: 0,
});
