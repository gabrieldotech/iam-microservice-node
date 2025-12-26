import type { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "../../../../modules/users/use-cases/factories/make-get-user-profile-use-case.js";

export async function getProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub;
  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({ userId });

  return reply.status(200).send({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
