import { firestore } from "../config/firebase";
import {
  pendingTelegramNotification,
  type TelegramNotification,
} from "../types/telegramNotification";

import type { Product } from "./product.service";

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
};

export type OrderItem = {
  id: number;
  name: string;
  roast: string;
  weight: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  id: number;
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  notification?: TelegramNotification;
};

export type CreateOrderItem = {
  productId: number;
  quantity: number;
};

export type CreateOrderInput = {
  customer: OrderCustomer;
  items: CreateOrderItem[];
};

const ORDERS_COLLECTION = "harz_orders";
const PRODUCTS_COLLECTION = "harz_products";

const getOrdersCollection = () => firestore.collection(ORDERS_COLLECTION);

function createOrderId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getOrders(): Promise<Order[]> {
  const snapshot = await getOrdersCollection().get();

  return snapshot.docs
    .map((document) => document.data() as Order)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: number): Promise<Order> {
  const snapshot = await getOrdersCollection().doc(String(id)).get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  return snapshot.data() as Order;
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (input.items.length === 0) {
    throw new Error("Order must contain at least one product.");
  }

  const requestedQuantities = new Map<number, number>();

  for (const item of input.items) {
    if (
      !Number.isInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Invalid order item.");
    }

    const currentQuantity = requestedQuantities.get(item.productId) ?? 0;

    requestedQuantities.set(item.productId, currentQuantity + item.quantity);
  }

  const id = createOrderId();
  const orderRef = getOrdersCollection().doc(String(id));

  const order = await firestore.runTransaction(async (transaction) => {
    const requestedItems = [...requestedQuantities.entries()];

    const productRefs = requestedItems.map(([productId]) =>
      firestore.collection(PRODUCTS_COLLECTION).doc(String(productId)),
    );

    // Все товары читаем внутри transaction.
    const productSnapshots = await transaction.getAll(...productRefs);

    const productMap = new Map<number, Product>();

    for (const snapshot of productSnapshots) {
      if (!snapshot.exists) {
        throw new Error(`Product ${snapshot.id} was not found.`);
      }

      const product = snapshot.data() as Product;

      productMap.set(product.id, product);
    }

    const orderItems: OrderItem[] = [];

    for (const [productId, requestedQuantity] of requestedItems) {
      const product = productMap.get(productId);

      if (!product) {
        throw new Error(`Product with id ${productId} was not found.`);
      }

      if (!product.inStock || product.stock <= 0) {
        throw new Error(`${product.name} is out of stock.`);
      }

      if (requestedQuantity > product.stock) {
        throw new Error(
          `Only ${product.stock} item(s) of ${product.name} are available.`,
        );
      }

      orderItems.push({
        id: product.id,
        name: product.name,
        roast: product.roast,
        weight: product.weight,
        price: product.price,
        image: product.image,
        quantity: requestedQuantity,
      });
    }

    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const createdOrder: Order = {
      id,
      createdAt: new Date().toISOString(),
      customer: input.customer,
      items: orderItems,
      total,
      status: "new",
      notification: pendingTelegramNotification(),
    };

    // Списываем остатки.
    for (const [productId, requestedQuantity] of requestedItems) {
      const product = productMap.get(productId);

      if (!product) {
        throw new Error(`Product with id ${productId} was not found.`);
      }

      const productRef = firestore
        .collection(PRODUCTS_COLLECTION)
        .doc(String(productId));

      const newStock = product.stock - requestedQuantity;

      transaction.update(productRef, {
        stock: newStock,

        // Если продали последнюю единицу,
        // товар автоматически становится недоступным.
        inStock: newStock > 0,
      });
    }

    // Заказ создаётся в той же transaction.
    transaction.set(orderRef, createdOrder);

    return createdOrder;
  });

  return order;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<Order> {
  const document = getOrdersCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  const order = snapshot.data() as Order;

  await document.update({ status });

  return { ...order, status };
}

export async function saveOrderNotification(
  id: number,
  notification: TelegramNotification,
): Promise<Order> {
  const document = getOrdersCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  await document.update({ notification });

  return { ...(snapshot.data() as Order), notification };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteOrder(id: number): Promise<void> {
  const document = getOrdersCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Order with id ${id} was not found.`);
  }

  await document.delete();
}
