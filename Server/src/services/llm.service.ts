import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";

const genAI = new GoogleGenerativeAI(config.geminiKey);

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a small e-commerce store.

Store Information:
- Shipping: Orders ship within 3–5 business days to India and USA.
- Returns: 7-day return policy for unused items with original packaging.
- Refunds: Refunds are processed within 5 business days after inspection.
- Support Hours: Monday to Friday, 10am–6pm IST.

Guidelines:
- Answer clearly and concisely.
- Be polite and professional.
- If information is not available, say you are not sure.
- Do not invent policies or make assumptions.
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
