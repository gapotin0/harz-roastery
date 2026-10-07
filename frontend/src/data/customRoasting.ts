import type { TelegramNotification } from "./telegramNotification";

export type CustomRoastingStatus =
  | "new"
  | "contacted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type CustomRoastingRequest = {
  id: number;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  coffee: {
    origin: string;
    quantity: string;
    roast: string;
    purpose: string;
  };
  message: string;
  status: CustomRoastingStatus;
  notification?: TelegramNotification;
};
