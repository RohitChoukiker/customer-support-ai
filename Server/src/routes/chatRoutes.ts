
import { FastifyInstance } from "fastify";
import { handleChatMessage } from "../services/chat.service.js";
import { prisma } from "../db/prisma.js";

export async function chatRoutes(app: FastifyInstance) {
  
  app.post( "/chat/message",{
    schema: {
      body: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            minLength: 1,
            description: "User message to the AI agent",
          },
          sessionId: {
            type: "string",
            description: "Optional session ID for conversation continuity",
          },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            reply: { type: "string" },
            sessionId: { type: "string" },
          },
        },
      },
    },
  },
  async (req, reply) => {
    const { message, sessionId } = req.body as {
      message: string;
      sessionId?: string;
    };
    try {
      // Input guardrails
      if (typeof message !== "string" || !message.trim()) {
        return (reply as any).status(400).send({
          error: "Message cannot be empty",
        });
      }
      let safeMessage = message.trim();
      const MAX_LEN = 1000;
      if (safeMessage.length > MAX_LEN) {
        safeMessage = safeMessage.slice(0, MAX_LEN);
      }

      // Defensive: never trust sessionId from client
      const result = await handleChatMessage(safeMessage, sessionId);
      return reply.send(result);
    } catch (err) {
      // Error handling guardrails
      console.error("/chat/message error", err);
      return (reply as any).status(500).send({
        error: "Sorry, something went wrong. Please try again later.",
      });
    }
  }
);


  app.get("/chat/history/:sessionId", async (req, reply) => {
    try {
      const { sessionId } = req.params as { sessionId: string };
      if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
        return (reply as any).status(400).send({ error: "Invalid sessionId." });
      }
      const conversation = await prisma.conversation.findUnique({
        where: { id: sessionId },
      });
      if (!conversation) {
        return (reply as any).status(404).send({ error: "Conversation not found" });
      }
      const messages = await prisma.message.findMany({
        where: { conversationId: sessionId },
        orderBy: { createdAt: "asc" },
        select: { sender: true, text: true, createdAt: true },
        take: 50, // Limit history for safety
      });
      return reply.send({ sessionId, messages });
    } catch (err) {
      console.error("/chat/history error", err);
      return (reply as any).status(500).send({ error: "Sorry, could not fetch history. Please try again later." });
    }
  });

}
