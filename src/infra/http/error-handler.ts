import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { UserAlreadyExistsError } from "../../core/errors/user-already-exists-error.js";
import { InvalidCredentialsError } from "../../core/errors/invalid-credentials-error.js";
import { ResourceNotFoundError } from "../../core/errors/resource-not-found-error.js";
import { InvalidRefreshTokenError } from "../../core/errors/invalid-refresh-token-error.js";
import { env } from "../../env/index.js";
import z from "zod";

export const errorHandler: FastifyInstance["errorHandler"] = (
  error,
  _,
  reply
) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      errors: z.treeifyError(error),
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (error instanceof InvalidRefreshTokenError) {
    return reply.status(401).send({ message: error.message });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
  return reply.status(500).send({ message: "Internal server error." });
};
