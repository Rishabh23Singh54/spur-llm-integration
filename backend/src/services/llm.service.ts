import { config } from "../config";
import { mockStreamReply } from "./mock-llm.service";
import { realStreamReply } from "./openai-llm.service";

export const streamReply = config.useMockLLM
  ? mockStreamReply
  : realStreamReply;
