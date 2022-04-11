export class ResponseError extends Error {
  private status: number;

  constructor (status: number = 500, message: string = 'Internal Server Error') {
    super(message)
    this.name = 'ResponseError'
    this.status = status
  }
}
