import { AppError } from "./app-error.js";

export class ResourceNotFoundError extends AppError {
  statusCode = 404;

  constructor() {
    super("Resource not found.");
  }
}
