import "dotenv/config";

import { firebaseAuth } from "../config/firebase";

async function main() {
  const uid = process.argv[2]?.trim();

  if (!uid) {
    console.error("Usage: npm run set-admin -- <firebase-uid>");
    process.exit(1);
  }

  await firebaseAuth.setCustomUserClaims(uid, { admin: true });

  console.log(`Admin role set for ${uid}.`);
  console.log("Ask that user to sign out and sign in again.");
}

void main();
