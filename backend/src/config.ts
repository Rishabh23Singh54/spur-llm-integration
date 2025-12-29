export const config = {
  port: process.env.PORT || 3001,
  useMockLLM: process.env.MOCK_LLM === "true",
  openApiKey: process.env.OPENAI_API_KEY || "",
  maxMessageLength: 1000,
  historyLimit: 20
};