import type { Area } from "react-easy-crop";

const OUTPUT_SIZE = 1200;

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);

    image.crossOrigin = "anonymous";
    image.src = url;
  });

const getRotatedSize = (width: number, height: number, rotation: number) => {
  const rotationRadians = (rotation * Math.PI) / 180;

  return {
    width:
      Math.abs(Math.cos(rotationRadians) * width) +
      Math.abs(Math.sin(rotationRadians) * height),
    height:
      Math.abs(Math.sin(rotationRadians) * width) +
      Math.abs(Math.cos(rotationRadians) * height),
  };
};

export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
): Promise<string> {
  const image = await createImage(imageSrc);
  const rotatedSize = getRotatedSize(image.width, image.height, rotation);
  const rotationCanvas = document.createElement("canvas");
  const rotationContext = rotationCanvas.getContext("2d");

  if (!rotationContext) {
    throw new Error("Could not create canvas context.");
  }

  rotationCanvas.width = Math.ceil(rotatedSize.width);
  rotationCanvas.height = Math.ceil(rotatedSize.height);

  rotationContext.translate(
    rotationCanvas.width / 2,
    rotationCanvas.height / 2,
  );
  rotationContext.rotate((rotation * Math.PI) / 180);
  rotationContext.translate(-image.width / 2, -image.height / 2);
  rotationContext.drawImage(image, 0, 0);

  const outputCanvas = document.createElement("canvas");
  const outputContext = outputCanvas.getContext("2d");

  if (!outputContext) {
    throw new Error("Could not create output canvas.");
  }

  outputCanvas.width = OUTPUT_SIZE;
  outputCanvas.height = OUTPUT_SIZE;

  outputContext.imageSmoothingEnabled = true;
  outputContext.imageSmoothingQuality = "high";

  outputContext.drawImage(
    rotationCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,

    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  return outputCanvas.toDataURL("image/webp", 0.82);
}
