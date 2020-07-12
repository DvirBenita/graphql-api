const config = require('./config')
const http = require('http')
const fs = require('fs')
const { getReading, getScan } = require('./generate')

const interval = 10000 // 10 seconds
const serverUrl = config.GRAPHQLAPI
const options = {
    hostname: serverUrl,
    port: 3000,
    path: '/graphql',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

/**
 * Creates HTTP POST request to graphql api and sends data in form of mutation query.
 *
 * @param {string} data - represent mutation queries recieved from ./generate.js module
 *
 */
const post = data => {
    const request = http.request(options, res => {
        res.setEncoding('utf8')

        res.pipe(fs.createWriteStream('./response.log', { flags: 'a' }))

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

/**
 * Get reading and scan create mutation query every 10 seconds.
 * Send request to graphql api with defined mutation queries by executing post function above.
 *
 */
let pivot = 0
setInterval(() => {
    if (pivot >= Number.MAX_SAFE_INTEGER) pivot = 0

    // change pivot to get more varied values in getReading and getScan functions
    pivot += 27

    const reading = getReading(pivot % 200)
    const scan = getScan(pivot)

    if (reading) post(reading)

    post(scan)
}, interval)
