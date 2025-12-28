import { prisma } from "../db/prisma";
import { generateReply } from "./llm.service";

export async function handleChatMessage(
  message: string,
  sessionId?: string
) {
  let conversation;

  if (sessionId) {
    conversation = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({ data: {} });
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  const history = messages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const reply = await generateReply(history, message);

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "ai",
      text: reply,
    },
  });

  return {
    reply,
    sessionId: conversation.id,
  };
}
