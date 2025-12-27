import { FastifyInstance } from "fastify";
import { handleChatMessage } from "../services/chat.service";

export async function chatRoutes(app: FastifyInstance) {
  app.post("/chat/message", async (req, reply) => {
    const { message, sessionId } = req.body as {
      message?: string;
      sessionId?: string;
    };

    if (!message || !message.trim()) {
      return reply.status(400).send({
        error: "Message cannot be empty",
      });
    }

    if (message.length > 1000) {
      return reply.status(400).send({
        error: "Message too long",
      });
    }

    try {
      return await handleChatMessage(message.trim(), sessionId);
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({
        error: "Something went wrong. Please try again.",
      });
    }
  });
}
