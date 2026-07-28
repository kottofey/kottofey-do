export class ApiError extends Error {
  public status: number;
  public details?: Record<string, unknown>;

  constructor({
    message,
    status,
    details,
  }: {
    message: string;
    status: number;
    details?: Record<string, unknown>;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}
