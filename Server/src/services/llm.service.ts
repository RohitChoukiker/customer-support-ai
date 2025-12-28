import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const genAI = new GoogleGenerativeAI(config.geminiKey);

const SYSTEM_PROMPT = `
You are a helpful, professional customer support agent for a small e-commerce store.

Your primary goal is to assist customers accurately, politely, and concisely, just like a real human support agent.

Store Information:
- Shipping: Orders ship within 3–5 business days to India and USA.
- Returns: We offer a 7-day return policy for unused items with original packaging.
- Refunds: Refunds are processed within 5 business days after inspection of returned items.
- Support Hours: Monday to Friday, 10am–6pm IST.

Guidelines:
- Answer clearly and concisely. Avoid unnecessary explanations.
- Be polite, calm, and professional at all times.
- Use the store information above as the single source of truth.
- Do NOT invent policies, prices, timelines, or guarantees.
- If a question is ambiguous, ask a short clarifying question.
- If information is not available, say so honestly instead of guessing.
- If a request is outside the scope of support (e.g., legal, medical, unrelated topics), politely explain that you cannot help with that.
- If appropriate, suggest contacting human support during support hours.

Always prioritize accuracy and clarity over being overly verbose.
`;



type HistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function generateReply(
  history: HistoryMessage[],
  userMessage: string
): Promise<string> {
  try {
   
    const trimmedHistory = history.slice(-10);

    const historyText = trimmedHistory
      .map(
        (h) =>
          `${h.role === "user" ? "User" : "Agent"}: ${h.content}`
      )
      .join("\n");

    const prompt = `
${SYSTEM_PROMPT}

Conversation so far:
${historyText}

User: ${userMessage}
Agent:
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: 256,  
        temperature: 0.4,     
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response?.trim() || "Sorry, I could not generate a response.";
  } catch (error) {
    console.error("LLM error:", error);

    
    return "Sorry, I'm having trouble right now. Please try again in a moment.";
  }
}
