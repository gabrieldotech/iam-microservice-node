import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { makeAuthenticateUserUseCase } from "../../../modules/users/use-cases/factories/make-authenticate-use-case.js";
import { authenticateSchema } from "../schemas/users.schema.js";

export async function authenticateRoute(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/sessions",
      { schema: authenticateSchema },
      async (request, reply) => {
        const { email, password } = request.body;

        const authenticateUseCase = makeAuthenticateUserUseCase();

        const { user } = await authenticateUseCase.execute({
          email,
          password_plain: password,
        });

        const token = await reply.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
              expiresIn: "10m",
            },
          }
        );

        const refreshToken = await reply.jwtSign(
          {},
          {
            sign: {
              sub: user.id,
              expiresIn: "7d",
            },
          }
        );

        return reply
          .setCookie("refreshToken", refreshToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: true,
          })
          .status(200)
          .send({
            token,
          });
      }
    );
}
