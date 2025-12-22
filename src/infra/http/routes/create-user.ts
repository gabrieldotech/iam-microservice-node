import type { FastifyInstance } from "fastify";
import { CreateUserUseCase } from "../../../modules/users/use-cases/create-user.use-case.js";
import { createUserSchema } from "../../../modules/users/validators/user-validator.js";
import { z } from "zod";

export async function createUser(app: FastifyInstance) {
  app.post("/users", async (req, reply) => {
    try {
      const { name, email, password } = createUserSchema.parse(req.body);
      const createUserUseCase = new CreateUserUseCase();
      const user = await createUserUseCase.execute({ name, email, password });
      const { password_hash, ...userResponse } = user;
      reply.status(201).send(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Erro de validação",
          errors: z.treeifyError(error),
        });
      }

      if (error instanceof Error) {
        if (error.message === "User already exists.") {
          return reply.status(409).send({ message: error.message });
        }
      }

      console.error(error);
      return reply.status(500).send({ message: "Erro interno no servidor." });
    }
  });
}
