import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authenticateSchema } from "../schemas/users.schema.js";
import { authenticateController } from "../controllers/users/authenticate.js";

export async function authenticateRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/sessions", { schema: authenticateSchema }, authenticateController);
}
