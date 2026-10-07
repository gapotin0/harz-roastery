import type { Request, Response } from "express";

import { uploadProductImage } from "../services/imageUpload.service";
import { ImageProcessingError } from "../services/optimizeImage";

const IMAGE_DATA_URL_PATTERN = /^data:image\/(webp|png|jpeg|jpg);base64,/i;

export async function uploadProductImageController(
  request: Request,
  response: Response,
) {
  const { image } = request.body as { image?: unknown };

  if (typeof image !== "string" || !IMAGE_DATA_URL_PATTERN.test(image)) {
    response.status(400).json({ message: "Invalid image data." });
    return;
  }

  try {
    const uploadedImage = await uploadProductImage(image);
    response.status(201).json(uploadedImage);
  } catch (error) {
    if (
      error instanceof ImageProcessingError ||
      (error instanceof Error &&
        (error.message.startsWith("Invalid image") ||
          error.message.startsWith("Image is")))
    ) {
      response.status(400).json({
        message: error instanceof Error ? error.message : "Invalid image.",
      });
      return;
    }

    console.error("Product image upload failed:", error);
    response.status(500).json({ message: "Failed to upload product image." });
  }
}
