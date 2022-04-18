export class ResponseJson extends Response {
  constructor (status: number = 200, body: any, cache?: number) {
    super(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${cache || 0}`,
      },
    })
  }
}
