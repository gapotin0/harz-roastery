import { API_URL } from "./apiBase";
import { auth } from "./firebase";

export type UploadedProductImage = {
  url: string;
  storagePath?: string;
  publicId?: string;
};

export async function uploadProductImage(
  image: string,
): Promise<UploadedProductImage> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Authentication required.");
  }

  const token = await user.getIdToken();

  const response = await fetch(`${API_URL}/api/uploads/product-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message ?? "Failed to upload image.");
  }

  return (await response.json()) as UploadedProductImage;
}
