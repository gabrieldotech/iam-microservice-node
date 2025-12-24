import { UserAlreadyExistsError } from "../../../core/errors/user-already-exists-error.js";
import type { IUsersRepository } from "../repositories/users-repository.interface.js";
import type { CreateUserData } from "../../../infra/http/schemas/users.schema.js";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: CreateUserData) {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
    });

    return user;
  }
}
