import type { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateUserUseCase } from "../../../../modules/users/use-cases/factories/make-create-user-use-case.js";

export async function createUserController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, password } = req.body as any;
  const createUserUseCase = makeCreateUserUseCase();

  const { user } = await createUserUseCase.execute({
    name,
    email,
    password,
  });

  const { password_hash, ...userResponse } = user;
  return reply.status(201).send({ user: userResponse });
}
