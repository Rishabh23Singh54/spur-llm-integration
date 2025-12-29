type Message = { sender: "user" | "ai"; text: string };

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "spurengineer.netlify.app";

export async function fetchHistory(sessionId?: string): Promise<Message[]> {
  if (!sessionId) return [];
  const res = await fetch(`${BASE_URL}/history/${sessionId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<{ reply: string; sessionId: string }> {
  const res = await fetch(`${BASE_URL}/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) throw new Error("Failed to send message");

  // If you want streaming (SSE) support:
  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let reply = "";

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      reply += chunk; // You can parse 'data:' lines if using SSE
    }
  } else {
    reply = await res.text();
  }

  return { reply, sessionId: sessionId || "new-session" };
}
