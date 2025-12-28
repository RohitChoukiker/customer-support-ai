import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 8080,
 
  geminiKey: process.env.GEMINI_API_KEY!,
  databaseUrl: process.env.DATABASE_URL!,
};
    