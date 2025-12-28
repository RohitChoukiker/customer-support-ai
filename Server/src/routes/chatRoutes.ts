
import { FastifyInstance } from "fastify";
import { handleChatMessage } from "../services/chat.service";
import { prisma } from "../db/prisma";

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

    const result = await handleChatMessage(message.trim(), sessionId);
    return reply.send(result);
  }
);


 app.get("/chat/history/:sessionId", async (req, reply) => {
    const { sessionId } = req.params as { sessionId: string };

    if (!sessionId) {
      return reply.status(400).send({
        error: "sessionId is required",
      });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });

    if (!conversation) {
      return reply.status(404).send({
        error: "Conversation not found",
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        sender: true,
        text: true,
        createdAt: true,
      },
    });

    return reply.send({
      sessionId,
      messages,
    });
  });

}
