import { AppError } from "./app-error.js";

export class UserAlreadyExistsError extends AppError {
  statusCode = 409;

  constructor() {
    super("User already exists.");
  }
}
