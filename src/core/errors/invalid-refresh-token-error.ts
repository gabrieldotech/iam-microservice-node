import { AppError } from "./app-error.js";

export class InvalidRefreshTokenError extends AppError {
  statusCode = 401;

  constructor() {
    super("Invalid refresh token.");
  }
}
