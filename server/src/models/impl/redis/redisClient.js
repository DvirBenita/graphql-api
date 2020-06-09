const redis = require('redis')
const bluebird = require('bluebird')

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis)

// Create a client and connect to Redis
const client = redis.createClient({
  host: process.env.REDIST_HOST,
  port: process.env.REDIS_PORT,
})

// This is a catch all basic error handler.
client.on('error', console.log)

module.exports = {
  getClient: () => client,
}
