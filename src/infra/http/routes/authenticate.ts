import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { AuthenticateUserUseCase } from "../../../modules/users/use-cases/authenticate-user.use-case.js";

export async function authenticateRoute(app: FastifyInstance) {
  app.post("/sessions", async (request, reply) => {
    const authenticateBodySchema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
      const authenticateUserUseCase = new AuthenticateUserUseCase();

      const { user } = await authenticateUserUseCase.execute({
        email,
        password_plain: password,
      });

      const token = await reply.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
            expiresIn: "7d",
          },
        }
      );

      return reply.status(200).send({
        user,
        token,
      });
    } catch (err) {
      return reply.status(401).send({ message: "Invalid credentials." });
    }
  });
}
