const http = require('http')
const fs = require('fs')
const { getReading, getScan } = require('./generate')

const interval = 10000 // 10 seconds
const serverUrl = '127.0.0.1'
const options = {
    hostname: serverUrl,
    port: 3000,
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
}

const post = (data) => {

    const request = http.request(options, res => {
        res.setEncoding('utf8')
    
        res.pipe(fs.createWriteStream('./response.log', {flags: 'a'}))
    
        res.on('end', () => {
            console.log('request have ended')
        })
    })

    request.on('error', err => {
        console.error(err.message)
    })
    request.write(data)
    request.end()

}

let pivot = 0
setInterval(() => {
    pivot += 27

    const reading = getReading(pivot % 200)
    const scan = getScan(pivot)

    if (reading)
        post(reading)

    post(scan)
    
}, interval)




