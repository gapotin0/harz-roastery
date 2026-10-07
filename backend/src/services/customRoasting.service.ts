import { firestore } from "../config/firebase";
import {
  pendingTelegramNotification,
  type TelegramNotification,
} from "../types/telegramNotification";

export type CustomRoastingStatus =
  | "new"
  | "contacted"
  | "in-progress"
  | "completed"
  | "cancelled";

export type CustomRoastingRequest = {
  id: number;
  createdAt: string;
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
  status: CustomRoastingStatus;
  notification?: TelegramNotification;
};

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

const COLLECTION = "harz_custom_roasting_requests";
const getCollection = () => firestore.collection(COLLECTION);

function createRequestId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getCustomRoastingRequests(): Promise<
  CustomRoastingRequest[]
> {
  const snapshot = await getCollection().get();

  return snapshot.docs
    .map((document) => document.data() as CustomRoastingRequest)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCustomRoastingRequest(
  id: number,
): Promise<CustomRoastingRequest> {
  const snapshot = await getCollection().doc(String(id)).get();

  if (!snapshot.exists) {
    throw new Error(`Custom roasting request with id ${id} was not found.`);
  }

  return snapshot.data() as CustomRoastingRequest;
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createCustomRoastingRequest(
  input: CreateCustomRoastingInput,
): Promise<CustomRoastingRequest> {
  const id = createRequestId();

  const request: CustomRoastingRequest = {
    id,
    createdAt: new Date().toISOString(),
    customer: {
      name: input.customer.name.trim(),
      email: input.customer.email.trim(),
      phone: input.customer.phone.trim(),
    },
    coffee: {
      origin: input.coffee.origin.trim(),
      quantity: input.coffee.quantity.trim(),
      roast: input.coffee.roast.trim(),
      purpose: input.coffee.purpose.trim(),
    },
    message: input.message.trim(),
    status: "new",
    notification: pendingTelegramNotification(),
  };

  await getCollection().doc(String(id)).set(request);

  return request;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateCustomRoastingStatus(
  id: number,
  status: CustomRoastingStatus,
): Promise<CustomRoastingRequest> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Custom roasting request with id ${id} was not found.`);
  }

  const request = snapshot.data() as CustomRoastingRequest;

  await document.update({ status });

  return { ...request, status };
}

export async function saveCustomRoastingNotification(
  id: number,
  notification: TelegramNotification,
): Promise<CustomRoastingRequest> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Custom roasting request with id ${id} was not found.`);
  }

  await document.update({ notification });

  return { ...(snapshot.data() as CustomRoastingRequest), notification };
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteCustomRoastingRequest(id: number): Promise<void> {
  const document = getCollection().doc(String(id));
  const snapshot = await document.get();

  if (!snapshot.exists) {
    throw new Error(`Custom roasting request with id ${id} was not found.`);
  }

  await document.delete();
}
