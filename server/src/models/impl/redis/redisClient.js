const config = require('../../../config')
const redis = require('redis')
const bluebird = require('bluebird')

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis)

// Create a client and connect to Redis
const client = redis.createClient({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
})

// This is a catch all basic error handler.
client.on('error', console.log)

module.exports = {
    getClient: () => client,
}
