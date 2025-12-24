import { AppError } from "./app-error.js";

export class InvalidCredentialsError extends AppError {
  statusCode = 401;

  constructor() {
    super("Invalid credentials.");
  }
}
