import {
  deleteProductImageFromFirebase,
  uploadProductImageToFirebase,
} from "./firebaseImageUpload.service";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type ImageUploadResult = {
  url: string;
  storagePath: string;
};

// ----------------------------------------------------------------------
// UPLOAD
// ----------------------------------------------------------------------

export async function uploadProductImage(
  dataUrl: string,
): Promise<ImageUploadResult> {
  return uploadProductImageToFirebase(dataUrl);
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteProductImage(storagePath?: string): Promise<void> {
  if (!storagePath) {
    return;
  }

  await deleteProductImageFromFirebase(storagePath);
}
