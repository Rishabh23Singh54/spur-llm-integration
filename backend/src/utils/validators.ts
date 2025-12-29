import { config } from "../config";

export function validateMessage(message: unknown): string {
    if (typeof message !== "string") {
        throw new Error("Invalid message type");
    }

    const trimmed = message.trim();
    if (!trimmed) {
        throw new Error("Message cannot be empty");
    }

    if (trimmed.length > config.maxMessageLength) {
        return trimmed.slice(0, config.maxMessageLength);
    }

    return trimmed;
}