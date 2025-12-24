import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../../core/errors/app-error.js";
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

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({
    message: "Internal server error.",
  });
};
