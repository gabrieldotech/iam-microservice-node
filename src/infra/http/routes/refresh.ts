import type { FastifyInstance } from "fastify";
import { InvalidRefreshTokenError } from "../../../core/errors/invalid-refresh-token-error.js";
import { refreshSchema } from "../schemas/users.schema.js";

export async function refresh(app: FastifyInstance) {
  app.patch(
    "/token/refresh",
    { schema: refreshSchema },
    async (request, reply) => {
      try {
        await request.jwtVerify({ onlyCookie: true });
      } catch (err) {
        throw new InvalidRefreshTokenError();
      }

      const { sub } = request.user;

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub,
            expiresIn: "10m",
          },
        }
      );

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub,
            expiresIn: "7d",
          },
        }
      );

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          secure: true,
          sameSite: true,
          httpOnly: true,
        })
        .status(200)
        .send({
          token,
        });
    }
  );
}
