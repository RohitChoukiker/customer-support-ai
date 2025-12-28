import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import middie from "@fastify/middie";
import helmet from "@fastify/helmet";

import { chatRoutes } from "./routes/chat.routes";
import { config } from "./config";

const app = Fastify({
  logger: true,
  bodyLimit: 1_000_000, 
  trustProxy: true,    
});


const allowedOrigins = [
  "http://localhost:5173",
  "https://spur-customer-support-ai.vercel.app",
];

await app.register(cors, {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"), false);
    }
  },
});


await app.register(helmet, {
  contentSecurityPolicy: false, 
});


await app.register(middie);


if (process.env.NODE_ENV !== "production") {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Customer Support API",
        description: "AI-powered customer support backend",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
}


await app.register(chatRoutes);


app.setErrorHandler((error, _req, reply) => {
  app.log.error(error);
  reply.status(500).send({
    error: "Internal server error",
  });
});


app.get("/health", async () => {
  return { status: "ok" };
});


const start = async () => {
  try {
    await app.listen({
      port: config.port,
      host: "0.0.0.0",
    });

    app.log.info(
      ` Customer Support API running on port http://localhost:${config.port}`
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();


const shutdown = async () => {
  app.log.info(" Shutting down server...");
  await app.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
