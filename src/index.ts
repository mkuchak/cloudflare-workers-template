function handleRequest (request: Request) {
  console.log('Request Path: ', new URL(request.url).pathname)

  return new Response('Hello, world!')
}

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})
