import { PrismaUsersRepository } from "../../prisma/prisma-users-repository.js";
import { GetUserProfileUseCase } from "../get-user-profile/get-user-profile.use-case.js";

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileUseCase(usersRepository);

  return useCase;
}
