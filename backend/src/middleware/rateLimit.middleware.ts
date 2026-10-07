import type { NextFunction, Request, Response } from "express";

type Bucket = {
  timestamps: number[];
};

const buckets = new Map<string, Bucket>();

type RateLimitOptions = {
  keyPrefix: string;
  windowMs: number;
  max: number;
};

function clientKey(request: Request): string {
  return request.ip || request.socket.remoteAddress || "unknown";
}

export function rateLimit(options: RateLimitOptions) {
  return (request: Request, response: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${options.keyPrefix}:${clientKey(request)}`;
    const bucket = buckets.get(key) ?? { timestamps: [] };

    bucket.timestamps = bucket.timestamps.filter(
      (timestamp) => now - timestamp < options.windowMs,
    );

    if (bucket.timestamps.length >= options.max) {
      response.status(429).json({
        message: "Too many requests. Please wait a few minutes and try again.",
      });
      return;
    }

    bucket.timestamps.push(now);
    buckets.set(key, bucket);

    if (buckets.size > 1000) {
      for (const [storedKey, storedBucket] of buckets) {
        storedBucket.timestamps = storedBucket.timestamps.filter(
          (timestamp) => now - timestamp < options.windowMs,
        );

        if (storedBucket.timestamps.length === 0) {
          buckets.delete(storedKey);
        }
      }
    }

    next();
  };
}

const publicFormWindowMs = 15 * 60 * 1000;

export const orderFormRateLimit = rateLimit({
  keyPrefix: "orders",
  windowMs: publicFormWindowMs,
  max: 8,
});

export const enrollmentFormRateLimit = rateLimit({
  keyPrefix: "enrollments",
  windowMs: publicFormWindowMs,
  max: 8,
});

export const roastingFormRateLimit = rateLimit({
  keyPrefix: "roasting",
  windowMs: publicFormWindowMs,
  max: 8,
});
