import type { TelegramNotification } from "./telegramNotification";

export type CourseEnrollmentStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

export type CourseEnrollment = {
  id: number;
  createdAt: string;
  course: {
    id: number;
    title: string;
    duration: string;
    price: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: CourseEnrollmentStatus;
  notification?: TelegramNotification;
};
