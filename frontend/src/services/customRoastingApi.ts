import { API_URL } from "./apiBase";
import { auth } from "./firebase";

import type {
  CustomRoastingRequest,
  CustomRoastingStatus,
} from "../data/customRoasting";

export type CreateCustomRoastingInput = {
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

export async function createCustomRoastingRequest(
  input: CreateCustomRoastingInput,
): Promise<CustomRoastingRequest> {
  const response = await fetch(`${API_URL}/api/custom-roasting`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to create custom roasting request.",
    );
  }

  return (await response.json()) as CustomRoastingRequest;
}

// ----------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------

export async function getCustomRoastingRequests(): Promise<
  CustomRoastingRequest[]
> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/custom-roasting`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to load custom roasting requests.",
    );
  }

  return (await response.json()) as CustomRoastingRequest[];
}

export async function updateCustomRoastingStatus(
  id: number,
  status: CustomRoastingStatus,
): Promise<CustomRoastingRequest> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/custom-roasting/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to update custom roasting request.",
    );
  }

  return (await response.json()) as CustomRoastingRequest;
}

export async function resendCustomRoastingNotification(
  id: number,
): Promise<CustomRoastingRequest> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/custom-roasting/${id}/notify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to send the roasting request to Telegram.",
    );
  }

  return (await response.json()) as CustomRoastingRequest;
}

export async function deleteCustomRoastingRequest(id: number): Promise<void> {
  const token = await getAdminToken();

  const response = await fetch(`${API_URL}/api/custom-roasting/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ?? "Failed to delete custom roasting request.",
    );
  }
}
