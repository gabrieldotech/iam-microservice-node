import { PrismaUsersRepository } from "../../prisma/prisma-users-repository.js";
import { AuthenticateUserUseCase } from "../authenticate-user.use-case.js";

export function makeAuthenticateUserUseCase() {
  const usersRepository = new PrismaUsersRepository(); // 1. Criamos a ferramenta
  const useCase = new AuthenticateUserUseCase(usersRepository); // 2. Entregamos a ferramenta via Constructor

  return useCase;
}
