import { CreateUserUseCase } from "../create-user.use-case.js";

export function makeCreateUserUseCase() {
  const useCase = new CreateUserUseCase();

  return useCase;
}
