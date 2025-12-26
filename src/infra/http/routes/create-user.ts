import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { createUserSchema } from "../schemas/users.schema.js";
import { createUserController } from "../controllers/users/create-user.js";

export async function createUser(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/users", { schema: createUserSchema }, createUserController);
}
