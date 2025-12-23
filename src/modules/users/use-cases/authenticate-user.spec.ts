import { expect, it, describe, beforeEach } from "vitest";
import { AuthenticateUserUseCase } from "./authenticate-user.use-case.js";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcrypt";

describe("Authenticate User Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    // 1. Criamos um usuário manualmente no repositório de memória
    // Precisamos hashear a senha porque o UseCase de login vai comparar hashes!
    const password_hash = await hash("123456", 10);

    const createdUser = await usersRepository.create({
      name: "Zé da Manga",
      email: "zedamanga@example.com",
      password_hash,
    });

    // 2. Tentamos autenticar com a senha em texto puro
    const { user } = await sut.execute({
      email: "zedamanga@example.com",
      password_plain: "123456",
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "Zé da Manga",
      email: "zedamanga@example.com",
      password_hash: await hash("123456", 10),
    });

    // Esperamos que rejeite com erro de credenciais inválidas
    await expect(() =>
      sut.execute({
        email: "zedamanga@example.com",
        password_plain: "senha-errada",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
