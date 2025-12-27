import Fastify from "fastify";
import cors from "@fastify/cors";
import { chatRoutes } from "./routes/chatRoutes";
import { config } from "./config";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true, 
});

app.register(chatRoutes);

app.listen(
  { port: config.port, host: "0.0.0.0" },
  () => {
    console.log(`Customer Support api running at port ${config.port}`);
  }
);
