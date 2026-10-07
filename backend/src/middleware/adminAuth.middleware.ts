import type { NextFunction, Request, Response } from "express";

import { firebaseAuth } from "../config/firebase";

export async function requireAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    response.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = authorization.substring("Bearer ".length);

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const allowedUids = new Set(
      (process.env.ADMIN_UID ?? "")
        .split(",")
        .map((uid) => uid.trim())
        .filter((uid) => uid.length > 0),
    );
    const hasAdminClaim = decodedToken.admin === true;

    if (!hasAdminClaim && !allowedUids.has(decodedToken.uid)) {
      response.status(403).json({ message: "Admin access required." });
      return;
    }

    next();
  } catch (error) {
    console.error("Firebase token verification failed:", error);
    response.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
}
