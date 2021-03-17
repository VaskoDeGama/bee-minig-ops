const http = require('http')
const router = require('./routes')
const port = /** @type {number} */ process.env.PORT || 3000
const host = 'localhost'
const server = http.createServer(router)

server.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}`)
})
