import { API_URL } from "./apiBase";
import { auth } from "./firebase";

import type { CartProduct } from "../data/products";

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

export async function getProducts(): Promise<CartProduct[]> {
  const response = await fetch(`${API_URL}/api/products`);

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  return (await response.json()) as CartProduct[];
}

// ----------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------

export async function createProduct(
  product: CartProduct,
): Promise<CartProduct> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to create product.");
  }

  return (await response.json()) as CartProduct;
}

export async function updateProduct(
  product: CartProduct,
): Promise<CartProduct> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/products/${product.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to update product.");
  }

  return (await response.json()) as CartProduct;
}

export async function deleteProduct(id: number): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to delete product.");
  }
}

export async function resetProducts(): Promise<CartProduct[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/api/products/reset`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to reset products.");
  }

  return (await response.json()) as CartProduct[];
}
