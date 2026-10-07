import type { TelegramNotification } from "./telegramNotification";

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderItem = {
  id: number;
  name: string;
  roast: string;
  weight: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
};

export type Order = {
  id: number;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notification?: TelegramNotification;
};
