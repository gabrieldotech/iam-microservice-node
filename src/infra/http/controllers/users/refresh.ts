import type { FastifyReply, FastifyRequest } from "fastify";
import { InvalidRefreshTokenError } from "../../../../core/errors/invalid-refresh-token-error.js";

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. Verifica se existe o Refresh Token no Cookie
    await request.jwtVerify({ onlyCookie: true });

    const { sub, role } = request.user;

    // 2. Gera um novo Access Token (10 min)
    const token = await reply.jwtSign(
      { role }, // Mantemos o RBAC no novo token
      { sign: { sub, expiresIn: "10m" } }
    );

    // 3. Gera um novo Refresh Token (Rotation - 7 dias)
    const refreshToken = await reply.jwtSign(
      { role },
      { sign: { sub, expiresIn: "7d" } }
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (err) {
    throw new InvalidRefreshTokenError();
  }
}
