const redis = require('./redisClient');
const _ = require('lodash')

const readingsSetKey = 'Readings:Set'

/**
 * Returns timestamp and UTC String of actual Time
 */
const getCurrentTime = () => {
    return {
        currentT: Date.now(),
        currentD: new Date(Date.now()).toUTCString()
    }
}

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

    timestamp = Number(timestamp)
    const client = redis.getClient()
    const readingKey = `${timestamp}:Reading`

    // get a hash represented by a reading key (timestamp)
    return await client.hgetallAsync(readingKey)

}
/**
 * Gets all Reading objects.
 */
const getAllReadings = async () => {

    const client = redis.getClient()
    const readings = []
    
    // get a set of all reading keys 
    const readingKeys = await client.smembersAsync(readingsSetKey)

    for (const key of readingKeys) {

        // get a hash represented by key (timestamp) in the set
        const reading = await client.hgetallAsync(key)

        if (reading)
            readings.push(reading)
    }

    return readings
}
/**
 * Creates new Reading object with given arguments.
 */
const createReading = async (timestamp, reading) => {
    
    timestamp = Number(timestamp)
    const { currentT, currentD } = getCurrentTime()
    const client = redis.getClient()
    const readingKey = `${timestamp}:Reading`

    // check duplicates
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
    
    // add a reading key (timestamp) to the set of readings
    await client.saddAsync(readingsSetKey, readingKey)
    
    // create a hash represented by reading key (timestamp)
    await client.hmsetAsync(readingKey, newReading)
    
    return newReading
}
/**
 * Deletes the Reading object represented by given email.
 */
const deleteReading = async timestamp => {

    const client = redis.getClient()
    const readingKey = `${timestamp}:Reading`

    // remove reading key (timestamp) from the set of readings
    await client.sremAsync(readingsSetKey, readingKey)

    // remove a hash represented by reading key (timestamp)
    const result = await client.delAsync(readingKey)
    
    return result ? true : false    
}

module.exports = {
    getReading,
    getAllReadings,
    createReading,
    deleteReading,
}