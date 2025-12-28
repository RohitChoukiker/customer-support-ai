import { prisma } from "../db/prisma.js";
import { generateReply } from "./llm.service.js";

export async function handleChatMessage(
  message: string,
  sessionId?: string
) {

  let conversation = null;
  if (sessionId && typeof sessionId === "string" && sessionId.trim()) {
    conversation = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });
  }
  if (!conversation) {
    conversation = await prisma.conversation.create({ data: {} });
  }


  const safeMessage = typeof message === "string" ? message.slice(0, 1000) : "";
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: safeMessage,
    },
  });


  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
    take: 10,
  });
    const history = messages.map((m: any) => ({
    role: m.sender === "user" ? "user" : "assistant" as "user" | "assistant",
    content: m.text,
  }));

  
  let reply = "Sorry, I couldn't generate a response right now.";
  try {
    reply = await generateReply(history, safeMessage);
  } catch (err) {
    console.error("LLM failure", err);
    reply = "Sorry, I'm having trouble answering right now. Please try again later.";
  }

  
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
