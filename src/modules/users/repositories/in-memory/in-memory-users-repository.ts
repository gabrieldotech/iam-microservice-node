import type { IUsersRepository } from "../users-repository.interface.js";
import type { Prisma, User } from "@prisma/client";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name ?? null,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? "MEMBER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }
}
