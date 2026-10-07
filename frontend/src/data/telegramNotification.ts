export type TelegramNotificationStatus = "pending" | "sent" | "failed";

export type TelegramNotification = {
  status: TelegramNotificationStatus;
  attempts: number;
  sentAt?: string;
  error?: string;
};
