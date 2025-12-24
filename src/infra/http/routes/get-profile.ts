import type { FastifyInstance } from "fastify";
import { prisma } from "../../../infra/database/prisma.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { getProfileSchema } from "../schemas/users.schema.js";
import { makeGetUserProfileUseCase } from "../../../modules/users/use-cases/factories/make-get-user-profile-use-case.js";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/me",
      { onRequest: [verifyJWT], schema: getProfileSchema },
      async (request, reply) => {
        const userId = request.user.sub;

        const getUserProfile = makeGetUserProfileUseCase();
        const { user } = await getUserProfile.execute({
          userId,
        });

        return reply.status(200).send({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      }
    );
}
