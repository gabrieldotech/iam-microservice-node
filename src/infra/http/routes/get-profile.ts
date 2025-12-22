import type { FastifyInstance } from "fastify";
import { prisma } from "../../../infra/database/prisma.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";

export async function getProfile(app: FastifyInstance) {
  app.get("/me", { onRequest: [verifyJWT] }, async (request, reply) => {
    const userId = request.user.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found." });
    }

    return reply.status(200).send({ user });
  });
}
