import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../../core/errors/unauthorized-error.js";

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      throw new UnauthorizedError();
    }
  };
}
