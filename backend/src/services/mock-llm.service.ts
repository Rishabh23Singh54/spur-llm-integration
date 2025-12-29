type Message = { sender: "user" | "ai"; text: string };

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Fetch conversation history from backend
export async function fetchHistory(sessionId?: string): Promise<Message[]> {
  if (!sessionId) return [];
  const res = await fetch(`${BASE_URL}/history/${sessionId}`);
  if (!res.ok) return [];
  return res.json();
}

// Send message to backend and optionally stream tokens
export async function sendMessage(
  message: string,
  sessionId?: string,
  onToken?: (token: string) => void
): Promise<{ reply: string; sessionId: string }> {
  const res = await fetch(`${BASE_URL}/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId })
  });

  if (!res.ok) throw new Error("Failed to send message");

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let reply = "";
  let newSessionId = sessionId;

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      // Parse SSE data lines
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace("data: ", "");
          // 'done' event carries sessionId
          if (line.startsWith("event: done")) {
            newSessionId = data;
          } else {
            reply += data;
            onToken?.(data);
          }
        }
      }
    }
  }

  return { reply, sessionId: newSessionId || "new-session" };
}
