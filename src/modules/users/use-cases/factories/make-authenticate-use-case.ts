import { PrismaUsersRepository } from "../../prisma/prisma-users-repository.js";
import { AuthenticateUserUseCase } from "../authenticate-user/authenticate-user.use-case.js";

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthenticateUserUseCase(usersRepository);
  return useCase;
}
