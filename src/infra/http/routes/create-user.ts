import type { FastifyInstance } from "fastify";
import { CreateUserUseCase } from "../../../modules/users/use-cases/create-user.use-case.js";
import { createUserSchema } from "../../../modules/users/validators/user-validator.js";

export async function createUser(app: FastifyInstance) {
  app.post("/users", async (req, reply) => {
    const { name, email, password } = createUserSchema.parse(req.body);
    const createUserUseCase = new CreateUserUseCase();
    const user = await createUserUseCase.execute({ name, email, password });
    const { password_hash, ...userResponse } = user;
    reply.status(201).send(userResponse);
  });
}
