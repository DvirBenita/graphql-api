const http = require('http')
const fs = require('fs')

function getReading() {
    return JSON.stringify(
        { 
            "timestamp": Date.now(),
            "reading": Math.floor(Math.random() * 350) - 100
        }
    )
}

const serverUrl = '127.0.0.1'
const options = {
    hostname: serverUrl,
    port: 3000,
    path: '/readings',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
}

function post(data) {

    const request = http.request(options, res => {
        res.setEncoding('utf8')
    
        res.pipe(fs.createWriteStream('./response.log'))
    
        res.on('end', () => {
            console.log('no more data in response')
        })
    })

    request.on('error', err => {
        console.error(err.message)
    })

    request.write(data)
    request.end()

}

setInterval(() => {
    post(getReading())
}, 1000)




