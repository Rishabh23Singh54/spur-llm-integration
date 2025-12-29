import { Router } from "express";
import {
  createConversation,
  saveMessage,
  getHistory
} from "../services/conversation.service";
import { streamReply } from "../services/llm.service";
import { rateLimit } from "../services/rate-limit";
import { validateMessage } from "../utils/validators";

export const chatRouter = Router();

/**
 * Fetch conversation history
 */
chatRouter.get("/history/:id", async (req, res) => {
  try {
    const messages = await getHistory(req.params.id);
    res.json(messages);
  } catch (err) {
    res.status(404).json([]);
  }
});

/**
 * Stream AI response (SSE)
 */
chatRouter.post("/stream", async (req, res) => {
  try {
      const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";
      if (!rateLimit(ip)) {
            return res.status(429).json({
                error: "Too many requests. Please slow down."
            });
        }
    const userMessage = validateMessage(req.body.message);
    let conversationId: string | undefined = req.body.sessionId;

    if (!conversationId) {
      conversationId = await createConversation();
    }

    await saveMessage(conversationId, "user", userMessage);

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const history = await getHistory(conversationId);

    let finalReply = "";

    await streamReply(history, (token: string) => {
      finalReply += token;
      res.write(`data: ${token}\n\n`);
    });

    await saveMessage(conversationId, "ai", finalReply);

    // signal completion + return sessionId
    res.write(`event: done\ndata: ${conversationId}\n\n`);
    res.end();

  } catch (err) {
    // Only write SSE error if headers already sent
    if (res.headersSent) {
      res.write(`event: error\ndata: failed\n\n`);
      res.end();
    } else {
      res.status(400).json({
        error: "Failed to process message"
      });
    }
  }
});
