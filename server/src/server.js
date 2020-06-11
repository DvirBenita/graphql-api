// require dotenv to access enviroment ( process.env ) variables
require('dotenv/config')

const http = require('http')
const app = require('./app')

const PORT = process.env.PORT || 3000
const server = http.createServer(app)

server.listen(PORT, (err) => {
    if (err) return console.error(err)
    console.log('server started on port: ' + PORT)
})