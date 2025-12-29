import { config } from "../config";
import { randomUUID } from "crypto";
import { getDb } from "../db";

export async function createConversation(): Promise<string> {
  const id = randomUUID();
  const db = getDb();

  await db.run(
    "INSERT INTO conversations (id) VALUES (?)",
    id
  );

  return id;
}

export function trimHistory(
  messages: { sender: string; text: string }[]
) {
  return messages.slice(-config.historyLimit);
}

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  const db = getDb();

  await db.run(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES (?, ?, ?, ?)`,
    randomUUID(),
    conversationId,
    sender,
    text
  );
}

export async function getHistory(conversationId: string) {
  const db = getDb();

  return db.all(
    `SELECT sender, text
     FROM messages
     WHERE conversation_id = ?
     ORDER BY created_at ASC`,
    conversationId
  );
}
