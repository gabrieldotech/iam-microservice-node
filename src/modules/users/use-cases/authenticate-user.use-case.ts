import { prisma } from "../../../infra/database/prisma.js";
import { compare } from "bcrypt";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from "./authenticate-user.dto.js";

export class AuthenticateUserUseCase {
  async execute({
    email,
    password_plain,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    // 1. Buscar o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await compare(password_plain, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials.");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
