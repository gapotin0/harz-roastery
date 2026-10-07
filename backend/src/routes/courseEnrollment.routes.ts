import { Router } from "express";

import {
  addCourseEnrollment,
  changeCourseEnrollmentStatus,
  getAllCourseEnrollments,
  removeCourseEnrollment,
  resendCourseEnrollmentToTelegram,
} from "../controllers/courseEnrollment.controller";

import { requireAdmin } from "../middleware/adminAuth.middleware";
import { enrollmentFormRateLimit } from "../middleware/rateLimit.middleware";

const courseEnrollmentRouter = Router();

// Public
courseEnrollmentRouter.post("/", enrollmentFormRateLimit, addCourseEnrollment);

// Admin only
courseEnrollmentRouter.get("/", requireAdmin, getAllCourseEnrollments);
courseEnrollmentRouter.patch(
  "/:id/status",
  requireAdmin,
  changeCourseEnrollmentStatus,
);
courseEnrollmentRouter.post(
  "/:id/notify",
  requireAdmin,
  resendCourseEnrollmentToTelegram,
);
courseEnrollmentRouter.delete("/:id", requireAdmin, removeCourseEnrollment);

export default courseEnrollmentRouter;
