export abstract class AppError extends Error {
  abstract statusCode: number;

  protected constructor(message: string) {
    super(message);
  }
}
