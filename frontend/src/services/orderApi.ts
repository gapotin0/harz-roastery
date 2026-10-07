import { auth } from "./firebase";

import type { Order, OrderCustomer, OrderStatus } from "../data/orders";

import { API_URL } from "./apiBase";

export type CreateOrderInput = {
  customer: OrderCustomer;
  items: {
    productId: number;
    quantity: number;
  }[];
};

async function getAdminToken(): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  return user.getIdToken();
}

// ----------------------------------------------------------------------
// PUBLIC
// ----------------------------------------------------------------------

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to create order.");
  }

  return (await response.json()) as Order;
}

// ----------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load orders.");
  }

  return (await response.json()) as Order[];
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to update order.");
  }

  return (await response.json()) as Order;
}

export async function resendOrderNotification(id: number): Promise<Order> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/orders/${id}/notify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to send the order to Telegram.",
    );
  }

  return (await response.json()) as Order;
}

export async function deleteOrder(id: number): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/orders/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to delete order.");
  }
}
