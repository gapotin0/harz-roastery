import type { Request, Response } from "express";

import {
  deliverTelegramNotification,
  deliverTelegramNotificationInBackground,
  sendCustomRoastingNotification,
} from "../services/telegram.service";
import {
  createCustomRoastingRequest,
  deleteCustomRoastingRequest,
  getCustomRoastingRequest,
  getCustomRoastingRequests,
  saveCustomRoastingNotification,
  updateCustomRoastingStatus,
  type CreateCustomRoastingInput,
  type CustomRoastingStatus,
} from "../services/customRoasting.service";
import { contactError } from "../utils/contact";

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

const CUSTOM_ROASTING_STATUSES: CustomRoastingStatus[] = [
  "new",
  "contacted",
  "in-progress",
  "completed",
  "cancelled",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCreateCustomRoastingInput(
  value: unknown,
): value is CreateCustomRoastingInput {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const data = value as Partial<CreateCustomRoastingInput>;

  if (typeof data.customer !== "object" || data.customer === null) {
    return false;
  }

  if (typeof data.coffee !== "object" || data.coffee === null) {
    return false;
  }

  return (
    isNonEmptyString(data.customer.name) &&
    isNonEmptyString(data.customer.email) &&
    isNonEmptyString(data.customer.phone) &&
    isNonEmptyString(data.coffee.origin) &&
    isNonEmptyString(data.coffee.quantity) &&
    isNonEmptyString(data.coffee.roast) &&
    isNonEmptyString(data.coffee.purpose) &&
    typeof data.message === "string"
  );
}

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getAllCustomRoastingRequests(
  _request: Request,
  response: Response,
) {
  try {
    const requests = await getCustomRoastingRequests();
    response.json(requests);
  } catch (error) {
    console.error("Get custom roasting requests error:", error);
    response.status(500).json({
      message: "Failed to load custom roasting requests.",
    });
  }
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function addCustomRoastingRequest(
  request: Request,
  response: Response,
) {
  if (!isCreateCustomRoastingInput(request.body)) {
    response.status(400).json({ message: "Invalid custom roasting request." });
    return;
  }

  try {
    const invalidContact = contactError(
      request.body.customer.email,
      request.body.customer.phone,
    );

    if (invalidContact) {
      response.status(400).json({ message: invalidContact });
      return;
    }

    const createdRequest = await createCustomRoastingRequest(request.body);

    deliverTelegramNotificationInBackground(
      () => sendCustomRoastingNotification(createdRequest),
      (notification) =>
        saveCustomRoastingNotification(createdRequest.id, notification),
    );

    response.status(201).json(createdRequest);
  } catch (error) {
    console.error("Create custom roasting request error:", error);
    response.status(500).json({
      message: "Failed to create custom roasting request.",
    });
  }
}

// ----------------------------------------------------------------------
// STATUS
// ----------------------------------------------------------------------

export async function resendCustomRoastingToTelegram(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      message: "Invalid custom roasting request id.",
    });
    return;
  }

  try {
    const roastingRequest = await getCustomRoastingRequest(id);
    const notification = await deliverTelegramNotification(() =>
      sendCustomRoastingNotification(roastingRequest),
    );
    const updatedRequest = await saveCustomRoastingNotification(
      id,
      notification,
    );

    response.json(updatedRequest);
  } catch (error) {
    console.error("Resend custom roasting notification error:", error);
    response.status(500).json({
      message: "Failed to send the roasting request to Telegram.",
    });
  }
}

export async function changeCustomRoastingStatus(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);
  const { status } = request.body as { status?: unknown };

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      message: "Invalid custom roasting request id.",
    });
    return;
  }

  if (
    typeof status !== "string" ||
    !CUSTOM_ROASTING_STATUSES.includes(status as CustomRoastingStatus)
  ) {
    response.status(400).json({ message: "Invalid custom roasting status." });
    return;
  }

  try {
    const updatedRequest = await updateCustomRoastingStatus(
      id,
      status as CustomRoastingStatus,
    );
    response.json(updatedRequest);
  } catch (error) {
    console.error("Update custom roasting status error:", error);
    response.status(500).json({
      message: "Failed to update custom roasting request.",
    });
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function removeCustomRoastingRequest(
  request: Request,
  response: Response,
) {
  const id = Number(request.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    response.status(400).json({
      message: "Invalid custom roasting request id.",
    });
    return;
  }

  try {
    await deleteCustomRoastingRequest(id);
    response.status(204).send();
  } catch (error) {
    console.error("Delete custom roasting request error:", error);
    response.status(500).json({
      message: "Failed to delete custom roasting request.",
    });
  }
}
