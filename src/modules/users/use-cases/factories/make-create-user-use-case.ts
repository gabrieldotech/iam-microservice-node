import { PrismaUsersRepository } from "../../prisma/prisma-users-repository.js";
import { CreateUserUseCase } from "../create-user.use-case.js";

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new CreateUserUseCase(usersRepository);

  return useCase;
}
