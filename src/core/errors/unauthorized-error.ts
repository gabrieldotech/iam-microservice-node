import { AppError } from "./app-error.js";

export class UnauthorizedError extends AppError {
  statusCode = 401;

  constructor() {
    super("Unauthorized: Insufficient permissions.");
  }
}
