import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { makeCreateUserUseCase } from "../../../modules/users/use-cases/factories/make-create-user-use-case.js";
import { createUserSchema } from "../schemas/users.schema.js";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/users",
    {
      schema: createUserSchema,
    },
    async (req, reply) => {
      const { name, email, password } = req.body;
      const createUserUseCase = makeCreateUserUseCase();
      const user = await createUserUseCase.execute({ name, email, password });
      const { password_hash, ...userResponse } = user;
      reply.status(201).send(userResponse);
    }
  );
}
