import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { getProfileSchema } from "../schemas/users.schema.js";
import { getProfileController } from "../controllers/users/get-user-profile.js";

export async function getProfile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/me",
      { onRequest: [verifyJWT], schema: getProfileSchema },
      getProfileController
    );
}
