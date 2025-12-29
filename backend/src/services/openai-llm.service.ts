import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { config } from "../config";

const client = new OpenAI({
  apiKey: config.openApiKey
});

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Policies:
- Shipping: Worldwide, ships in 2 business days
- Returns: 30-day return window
- Refunds: 5–7 business days
- Support: Mon–Fri, 9am–6pm IST
`;

export async function realStreamReply(
  history: { sender: "user" | "ai"; text: string }[],
  onToken: (token: string) => void
) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history.map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    })) as ChatCompletionMessageParam[])
  ];

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
    max_tokens: 300
  });

  let full = "";

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) {
      full += token;
      onToken(token);
    }
  }

  return full;
}
