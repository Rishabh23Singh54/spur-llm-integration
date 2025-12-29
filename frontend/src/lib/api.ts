// frontend/src/lib/api.ts
type Message = { sender: "user" | "ai"; text: string };

export async function fetchHistory(sessionId?: string): Promise<Message[]> {
  // Simulate fetching previous messages with a small delay
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve([
        { sender: "ai", text: "Hello! I am your support assistant." },
      ]);
    }, 300)
  );
}

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<{ reply: string; sessionId: string }> {
  // Simulate AI reply with a small delay
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        reply: `You said: "${message}" (mock reply)`,
        sessionId: sessionId || "mock-session-123",
      });
    }, 500)
  );
}
