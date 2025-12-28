import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import middie from "@fastify/middie";
import morgan from "morgan";

import { chatRoutes } from "./routes/chatRoutes";
import { config } from "./config";

const app = Fastify({ logger: true });


app.register(cors, {
  origin: true,
});

await app.register(middie);


app.use(morgan("dev")); 
app.register(swagger, {
  openapi: {
    info: {
      title: "Customer Support API",
      description: "AI-powered customer support backend",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
  },
});

app.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});


app.register(chatRoutes);

app.listen(
  { port: config.port, host: "0.0.0.0" },
  () => {
    console.log(`Customer Support API running at http://0.0.0.0:${config.port}`);
  
  }
);
