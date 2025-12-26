import type { FastifyReply, FastifyRequest } from "fastify";
import { makeAuthenticateUserUseCase } from "../../../../modules/users/use-cases/factories/make-authenticate-use-case.js";

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as any;

  const authenticateUseCase = makeAuthenticateUserUseCase();

  const { user } = await authenticateUseCase.execute({
    email,
    password_plain: password,
  });

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: "10m" } }
  );

  const refreshToken = await reply.jwtSign(
    {},
    { sign: { sub: user.id, expiresIn: "7d" } }
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: true,
    })
    .status(200)
    .send({ token });
}
