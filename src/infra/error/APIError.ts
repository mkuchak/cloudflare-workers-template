export class APIError extends Error {
  private status: number;
  private error: string;

  constructor (status: number = 500, message: string = 'Internal Server Error') {
    super(message)
    this.error = message
    this.status = status
  }
}
