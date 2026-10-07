// Production is served from Firebase Hosting, which proxies /api to the backend.
// Local development keeps talking to the API on localhost.
export const API_URL = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL ?? "http://localhost:3001");
