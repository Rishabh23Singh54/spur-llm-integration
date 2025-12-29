import * as express from "express";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { chatRouter } from "./routes/chat";
import { config } from "./config";
import { initDb } from "./db";

dotenv.config();

async function start() {
  await initDb();

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/chat", chatRouter);
  app.get("/", (req, res) => {
    res.send("AI Chat backend is running!");
  });

  app.listen(config.port, () => {
    console.log(`Backend running on port ${config.port}`);
  });
}

start().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
