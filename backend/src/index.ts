import "dotenv/config";
import { createServer } from "node:http";
import { expressApplication } from "./app/app.js";

(function main() {
  const nodeServer = createServer(expressApplication());

  const PORT = process.env.PORT ?? 8000;

  nodeServer.listen(PORT, () => {
    console.log(`Server starts in PORT ${PORT}`);
  });
})();
