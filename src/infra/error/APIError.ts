export class APIError extends Error {
  private readonly status: number;
  private readonly error: string;

  constructor (status: number = 500, message: string = 'Internal Server Error') {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.error = message
    this.status = status

    Error.captureStackTrace(this)
  }
}
