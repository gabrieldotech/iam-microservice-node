import type { FastifyInstance } from "fastify";
import { refreshController } from "../controllers/users/refresh.js";
import { refreshSchema } from "../schemas/users.schema.js";

export async function refreshToken(app: FastifyInstance) {
  app.patch("/token/refresh", { schema: refreshSchema }, refreshController);
}
