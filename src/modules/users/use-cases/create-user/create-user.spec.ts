import { expect, it, describe, beforeEach } from "vitest";
import { CreateUserUseCase } from "./create-user.use-case.js";
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository.js";

describe("Create User Use Case", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "Zé da manga",
      email: "zedamanga@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.role).toEqual("MEMBER");
  });

  it("should not be able to register with same email twice", async () => {
    const email = "zedamanga@example.com";

    await sut.execute({
      name: "Zé da manga",
      email,
      password: "password123",
    });

    await expect(() =>
      sut.execute({
        name: "Zé da manga",
        email,
        password: "password123",
      })
    ).rejects.toBeInstanceOf(Error);
  });
  it("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "Zé da manga",
      email: "zedamanga@example.com",
      password: "password123",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.role).toEqual("MEMBER");
  });
});
