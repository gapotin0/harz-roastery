import { Router } from "express";

import {
  addOrder,
  changeOrderStatus,
  getAllOrders,
  removeOrder,
  resendOrderToTelegram,
} from "../controllers/order.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";
import { orderFormRateLimit } from "../middleware/rateLimit.middleware";

const orderRouter = Router();

// Public (customer checkout)
orderRouter.post("/", orderFormRateLimit, addOrder);

// Admin only
orderRouter.get("/", requireAdmin, getAllOrders);
orderRouter.patch("/:id/status", requireAdmin, changeOrderStatus);
orderRouter.post("/:id/notify", requireAdmin, resendOrderToTelegram);
orderRouter.delete("/:id", requireAdmin, removeOrder);

export default orderRouter;
