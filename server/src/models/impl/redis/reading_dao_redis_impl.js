const redis = require('./redisClient');
const _ = require('lodash')

const readingsSetKey = 'Readings:Set'

/**
 * Gets the Reading object for a given timestamp.
 */
const getReading = async timestamp => {

    const { currentT, currentD } = getCurrentTime()
    if (timestamp === undefined)
        return {
            timestamp: currentT,
            date: currentD,
            reading: 0,
        }

    const client = redis.getClient()
    
    timestamp = Number(timestamp)
    const readingKey = `${timestamp}:Reading`

    const reading = client.hgetallAsync(readingKey)
    return reading

}
/**
 * Gets all Reading objects.
 */
const getAllReadings = async () => {

    const client = redis.getClient()
    const readingKeys = await client.smembersAsync(readingsSetKey)
    const readings = []

    for (const key of readingKeys) {
        const reading = await client.hgetallAsync(key)

        if (reading)
            readings.push(reading)
    }

    return readings
}
/**
 * Creates new Reading object with given attributes.
 */
const createReading = async (timestamp, reading) => {
    
    const client = redis.getClient()
    const { currentT, currentD } = getCurrentTime()
    
    timestamp = Number(timestamp)
    const readingKey = `${timestamp}:Reading`

    // checking duplicates
    if (await client.hgetAsync(readingKey, 'reading') !== null)
        return {
            timestamp: currentT,
            date: currentD,
            reading: 0,
        }

    const newReading = {
        timestamp: new Date(timestamp),
        date: new Date(timestamp).toUTCString(),
        reading: reading
    }
    
    await client.saddAsync(readingsSetKey, readingKey)
    await client.hmsetAsync(readingKey, newReading)
    return newReading
}
/**
 * Deletes the Reading object represented by given email.
 */
const deleteReading = async timestamp => {
    const client = redis.getClient()
    const readingKey = `${timestamp}:Reading`

    await client.sremAsync(readingsSetKey, readingKey)
    const result = await client.delAsync(readingKey)
    
    return result ? true : false    
}

module.exports = {
    getReading,
    getAllReadings,
    createReading,
    deleteReading,
}