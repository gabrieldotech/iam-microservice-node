import { prisma } from "../../../infra/database/prisma.js";
import type { IUsersRepository } from "../repositories/users-repository.interface.js";
import type { Prisma, User } from "@prisma/client";

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ data });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }
}
