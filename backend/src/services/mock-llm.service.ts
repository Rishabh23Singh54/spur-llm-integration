const POLICIES = {
  shipping: "We ship worldwide and orders are dispatched within 2 business days.",
  returns: "We offer a 30-day return window for unused items in original packaging.",
  refunds: "Refunds are processed within 5–7 business days after inspection.",
  support: "Our support team is available Monday to Friday, 9am–6pm IST."
};

function generateMockReply(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("ship") || text.includes("delivery")) {
    return POLICIES.shipping;
  }

  if (text.includes("return")) {
    return POLICIES.returns;
  }

  if (text.includes("refund")) {
    return POLICIES.refunds;
  }

  if (text.includes("support") || text.includes("contact") || text.includes("help")) {
    return POLICIES.support;
  }

  if (text.includes("hi") || text.includes("hello")) {
    return "Hello! How can I help you today?";
  }

  return (
    "Thanks for your message. A support agent will be happy to assist you. " +
    "You can ask about shipping, returns, refunds, or support hours."
  );
}

export async function mockStreamReply(
  history: { sender: "user" | "ai"; text: string }[],
  onToken: (token: string) => void
) {
  const lastUserMessage =
    [...history].reverse().find(m => m.sender === "user")?.text ?? "";

  const reply = generateMockReply(lastUserMessage);

  // Simulate streaming
  for (const char of reply) {
    await new Promise(r => setTimeout(r, 12));
    onToken(char);
  }

  return reply;
}
