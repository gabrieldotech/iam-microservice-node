import { prisma } from "../../../infra/database/prisma.js";
import type { CreateUserData } from "../validators/user-validator.js";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  async execute(data: CreateUserData) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      throw new Error("User already exists.");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: passwordHash,
      },
    });

    return user;
  }
}
