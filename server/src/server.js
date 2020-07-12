const config = require('./config')
const http = require('http')
const app = require('./app')

const server = http.createServer(app)

server.listen(config.PORT, err => {
    if (err) return console.error(err)
    console.log('server started on port: ' + config.PORT)
})
