import { firestore } from "../config/firebase";
import { defaultProducts } from "../data/defaultProducts";
import { deleteProductImage } from "./imageUpload.service";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type LocalizedProductText = {
  en: string;
  uk: string;
};

export type ProductCategory = "single-origin" | "espresso" | "rare" | "decaf";

export type Product = {
  id: number;
  name: string;
  roast: string;
  roastColor: string;
  weight: string;
  price: number;
  description: LocalizedProductText;
  category: ProductCategory;

  inStock: boolean;
  stock: number;

  image: string;
  imageStoragePath?: string;
  imagePublicId?: string;

  popularity: number;
};

const PRODUCTS_COLLECTION = "harz_products";
const getCollection = () => firestore.collection(PRODUCTS_COLLECTION);

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getCollection().get();

  return snapshot.docs
    .map((document) => document.data() as Product)
    .sort((a, b) => a.id - b.id);
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createProduct(product: Product): Promise<Product> {
  const document = getCollection().doc(String(product.id));
  const existing = await document.get();

  if (existing.exists) {
    throw new Error(`Product with id ${product.id} already exists.`);
  }

  await document.set(product);

  return product;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateProduct(
  id: number,
  product: Product,
): Promise<Product> {
  const document = getCollection().doc(String(id));
  const existing = await document.get();

  if (!existing.exists) {
    throw new Error(`Product with id ${id} was not found.`);
  }

  const previousProduct = existing.data() as Product;

  const updatedProduct: Product = { ...product, id };

  await document.set(updatedProduct, { merge: false });

  const imageChanged = previousProduct.image !== updatedProduct.image;

  if (imageChanged && previousProduct.imageStoragePath) {
    try {
      await deleteProductImage(previousProduct.imageStoragePath);
    } catch (error) {
      console.error("Failed to remove old product image:", error);
    }
  }

  return updatedProduct;
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteProduct(id: number): Promise<void> {
  const document = getCollection().doc(String(id));
  const existing = await document.get();

  if (!existing.exists) {
    throw new Error(`Product with id ${id} was not found.`);
  }

  const product = existing.data() as Product;

  await document.delete();

  if (product.imageStoragePath) {
    try {
      await deleteProductImage(product.imageStoragePath);
    } catch (error) {
      console.error("Failed to remove product image:", error);
    }
  }
}

// ----------------------------------------------------------------------
// RESET
// ----------------------------------------------------------------------

export async function resetProducts(): Promise<Product[]> {
  const snapshot = await getCollection().get();

  const previousProducts = snapshot.docs.map(
    (document) => document.data() as Product,
  );

  const batch = firestore.batch();

  for (const document of snapshot.docs) {
    batch.delete(document.ref);
  }

  for (const product of defaultProducts) {
    const ref = getCollection().doc(String(product.id));

    batch.set(ref, product);
  }

  await batch.commit();

  for (const product of previousProducts) {
    if (!product.imageStoragePath) {
      continue;
    }

    try {
      await deleteProductImage(product.imageStoragePath);
    } catch (error) {
      console.error(`Failed to remove image for product ${product.id}:`, error);
    }
  }

  return defaultProducts;
}
