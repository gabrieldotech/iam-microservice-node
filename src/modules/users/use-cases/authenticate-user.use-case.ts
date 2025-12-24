import type { IUsersRepository } from "../repositories/users-repository.interface.js";
import { compare } from "bcrypt";
import type {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from "./authenticate-user.dto.js";
import { InvalidCredentialsError } from "../../../core/errors/invalid-credentials-error.js";

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}
  async execute({
    email,
    password_plain,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await compare(password_plain, user.password_hash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
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
