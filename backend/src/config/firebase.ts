import "dotenv/config";

import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ----------------------------------------------------------------------
// CONFIG
// ----------------------------------------------------------------------

// Cloud Functions already authenticate as the runtime service account.
// A local credentials path from .env would point at a file that is not deployed.
if (process.env.K_SERVICE) {
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

const storageBucket = (
  process.env.STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET
)?.trim();

if (!storageBucket) {
  throw new Error("STORAGE_BUCKET is not configured.");
}

// ----------------------------------------------------------------------
// FIREBASE
// ----------------------------------------------------------------------

const firebaseApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault(),
        storageBucket,
      });

export const firebaseAuth = getAuth(firebaseApp);

export const firestore = getFirestore(firebaseApp);

export const firebaseStorage = getStorage(firebaseApp);
