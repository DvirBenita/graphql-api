const redis = require('./redisClient')
const keyGenerator = require('./redisKeyGenerator')
const _ = require('lodash')

/**
 * Gets the Reading object for a given timestamp.
 */
const getReading = async timestamp => {

    if (timestamp === undefined)
        return {
            timestamp: 0,
            date: 'Timestamp not specified',
            value: 0,
        }

    timestamp = Number(timestamp)
    const client = redis.getClient()
    const readingKey = keyGenerator.getReadingHashKey(timestamp)

    // get a hash represented by a reading key (timestamp)
    const reading = await client.hgetallAsync(readingKey)
    if (reading) {
        reading.timestamp = Number(reading.timestamp)
        reading.value = Number(reading.value)
    }

    return reading
}
/**
 * Gets all Reading objects.
 */
const getAllReadings = async () => {

    const client = redis.getClient()
    const readings = []
    
    // get a set of all reading keys 
    const readingKeys = await client.smembersAsync(keyGenerator.getReadingsSetKey())

    for (const key of readingKeys) {

        // get a hash represented by key (timestamp) in the set
        const reading = await client.hgetallAsync(key)

        if (reading){
            reading.timestamp = Number(reading.timestamp)
            reading.value = Number(reading.value)
            readings.push(reading)
        }
    }

    return readings
}
/**
 * Creates new Reading object with given arguments.
 */
const createReading = async reading => {
    
    const timestamp = Number(reading.timestamp)
    const client = redis.getClient()
    const readingKey = keyGenerator.getReadingHashKey(timestamp)

    // check duplicates
    if (await client.hgetAsync(readingKey, 'value') !== null)
        return {
            timestamp: 0,
            date: "Already Exists",
            value: 0,
        }

    const newReading = {
        timestamp: timestamp,
        date: new Date(timestamp).toUTCString(),
        value: reading.value
    }
    
    // add a reading key (timestamp) to the set of readings
    await client.saddAsync(keyGenerator.getReadingsSetKey(), readingKey)
    
    // create a hash represented by reading key (timestamp)
    await client.hmsetAsync(readingKey, newReading)
    
    return newReading
}
/**
 * Deletes the Reading object represented by given email.
 */
const deleteReading = async timestamp => {

    const client = redis.getClient()
    const readingKey = keyGenerator.getReadingHashKey(timestamp)

    // remove reading key (timestamp) from the set of readings
    await client.sremAsync(keyGenerator.getReadingsSetKey(), readingKey)

    // remove a hash represented by reading key (timestamp)
    const result = await client.delAsync(readingKey)
    
    return result ? true : false    
}
/**
 * Deletes all Reading objects.
 */
const deleteAllReadings = async () => {
    const client = redis.getClient()
    
    // get a set of all reading keys 
    const readingKeys = await client.smembersAsync(keyGenerator.getReadingsSetKey())

    for (const key of readingKeys) {

        // remove hashes represented by keys in set
        await client.delAsync(key)

    }

    // delete whole set of readings
    await client.delAsync(keyGenerator.getReadingsSetKey())

    return true
}

module.exports = {
    getReading,
    getAllReadings,
    createReading,
    deleteReading,
    deleteAllReadings,
}