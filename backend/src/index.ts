import dotenv from "dotenv";

import { app } from "./app";

dotenv.config({ path: ".env.local" });

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`HARZ backend running on http://localhost:${PORT}`);
});
