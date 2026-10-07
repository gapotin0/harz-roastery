import { randomUUID } from "node:crypto";

import { getDownloadURL } from "firebase-admin/storage";

import { firebaseStorage } from "../config/firebase";
import { optimizeImageToWebp } from "./optimizeImage";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type FirebaseImageUploadResult = {
  url: string;
  storagePath: string;
};

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

function parseImageDataUrl(dataUrl: string): Buffer {
  const match = dataUrl.match(/^data:image\/(?:webp|jpeg|png);base64,(.+)$/);

  if (!match) {
    throw new Error(
      "Invalid image. Only WEBP, JPEG and PNG images are supported.",
    );
  }

  const buffer = Buffer.from(match[1], "base64");

  if (buffer.length === 0) {
    throw new Error("Image is empty.");
  }

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error("Image is too large. Maximum size is 8 MB.");
  }

  return buffer;
}

// ----------------------------------------------------------------------
// UPLOAD
// ----------------------------------------------------------------------

export async function uploadProductImageToFirebase(
  dataUrl: string,
): Promise<FirebaseImageUploadResult> {
  const source = parseImageDataUrl(dataUrl);
  const buffer = await optimizeImageToWebp(source);
  const storagePath = `products/${randomUUID()}.webp`;

  const bucket = firebaseStorage.bucket();
  const file = bucket.file(storagePath);

  await file.save(buffer, {
    resumable: false,
    metadata: {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const url = await getDownloadURL(file);

  return { url, storagePath };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteProductImageFromFirebase(
  storagePath: string,
): Promise<void> {
  if (!storagePath.trim()) {
    return;
  }

  const bucket = firebaseStorage.bucket();
  const file = bucket.file(storagePath);

  const [exists] = await file.exists();

  if (!exists) {
    return;
  }

  await file.delete();
}
