import { Router } from "express";

import {
  addCustomRoastingRequest,
  changeCustomRoastingStatus,
  getAllCustomRoastingRequests,
  removeCustomRoastingRequest,
  resendCustomRoastingToTelegram,
} from "../controllers/customRoasting.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";
import { roastingFormRateLimit } from "../middleware/rateLimit.middleware";

const customRoastingRouter = Router();

// Public
customRoastingRouter.post(
  "/",
  roastingFormRateLimit,
  addCustomRoastingRequest,
);

// Admin only
customRoastingRouter.get("/", requireAdmin, getAllCustomRoastingRequests);
customRoastingRouter.patch(
  "/:id/status",
  requireAdmin,
  changeCustomRoastingStatus,
);
customRoastingRouter.post(
  "/:id/notify",
  requireAdmin,
  resendCustomRoastingToTelegram,
);
customRoastingRouter.delete("/:id", requireAdmin, removeCustomRoastingRequest);

export default customRoastingRouter;
