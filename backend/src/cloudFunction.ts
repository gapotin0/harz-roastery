import { onRequest } from "firebase-functions/v2/https";

import { app } from "./app";

export const api = onRequest(
  {
    region: "europe-west1",
    invoker: "public",
    cors: false,
    memory: "512MiB",
    timeoutSeconds: 60,
    serviceAccount:
      "firebase-adminsdk-fbsvc@harz-rostery.iam.gserviceaccount.com",
  },
  app,
);
