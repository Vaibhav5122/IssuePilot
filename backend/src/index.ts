import "dotenv/config";
import { createServer } from "node:http";
import { expressApplication } from "./app/app.js";
import { envZod } from "./app/utils/envSanitizations.js";

(async function main() {
  try {
    const nodeServer = createServer(await expressApplication());

    const PORT: Number = envZod.PORT ? +envZod.PORT : 8000;

    nodeServer.listen(PORT, () => {
      console.log(`Server starts in PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
})();
