export class ResponseJson extends Response {
  constructor (status: number = 200, body: any) {
    super(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
