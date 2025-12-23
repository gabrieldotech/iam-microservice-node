import type { FastifyInstance } from "fastify";
import { makeCreateUserUseCase } from "../../../modules/users/use-cases/factories/make-create-user-use-case.js";
import { createUserSchema } from "../../../modules/users/validators/user-validator.js";

export async function createUser(app: FastifyInstance) {
  app.post("/users", async (req, reply) => {
    const { name, email, password } = createUserSchema.parse(req.body);
    const createUserUseCase = makeCreateUserUseCase();
    const user = await createUserUseCase.execute({ name, email, password });
    const { password_hash, ...userResponse } = user;
    reply.status(201).send(userResponse);
  });
}
