import sharp from "sharp";

const MAX_EDGE = 1200;
const WEBP_QUALITY = 80;

export class ImageProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageProcessingError";
  }
}

export async function optimizeImageToWebp(input: Buffer): Promise<Buffer> {
  try {
    const output = await sharp(input, {
      failOn: "none",
      limitInputPixels: 40_000_000,
    })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toBuffer();

    if (output.length === 0) {
      throw new Error("Empty output.");
    }

    return output;
  } catch (error) {
    if (error instanceof ImageProcessingError) {
      throw error;
    }

    throw new ImageProcessingError(
      "Could not process this image. Use a JPEG, PNG or WebP file.",
    );
  }
}
