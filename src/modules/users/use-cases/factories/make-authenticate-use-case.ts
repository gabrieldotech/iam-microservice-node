import { AuthenticateUserUseCase } from "../authenticate-user.use-case.js";

export function makeAuthenticateUserUseCase() {
  const useCase = new AuthenticateUserUseCase();

  return useCase;
}
