const redis = require('./redisClient');
const _ = require('lodash')

const scansSetKey = 'Scans:Set'

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
 * Gets the Scan object for a given timestamp.
 */
const getScan = async timestamp => {
    
    const { currentT, currentD } = getCurrentTime()
    if (timestamp === undefined) 
        return {
            timestamp: currentT,
            date: currentD,
            email: '',
            status: 'Timestamp not provided',
        }
    
    timestamp = Number(timestamp)
    const client = redis.getClient()
    const scanKey = `${timestamp}:Scan`

    // get a hash represented by a scan key (timestamp)
    return await client.hgetallAsync(scanKey)
}
/**
 * Gets all Scan objects grouped by given arguments.
 */
const getScans = async (email, status) => {

    const client = redis.getClient()
    const scans = []

    // get a set of all scan keys 
    const scanKeys = await client.smembersAsync(scansSetKey)

    for (const key of scanKeys) {

        // get a hash represented by key (timestamp) in the set
        const scan = await client.hgetallAsync(key)

        if (scan)
            scans.push(scan)
    }
 
    if (!email && !status)
        return scans
    else if (!status)
        return _.filter(scans, {email: email})
    else if (!email)
        return _.filter(scans, {status: status})
    else 
        return _.filter(scans, {email: email, status: status})
}   
/**
 * Creates new Scan object with given arguments.
 */
const createScan = async (timestamp, email, status) => {

    timestamp = Number(timestamp)
    const { currentT, currentD } = getCurrentTime()
    const client = redis.getClient()
    const scanKey = `${timestamp}:Scan`

    // check duplicates
    if (await client.hgetAsync(scanKey, 'email') !== null)
        return {
            timestamp: currentT,
            date: currentD,
            email: '',
            status: 'Duplicate found',
        }

    const newScan = {
        timestamp: new Date(timestamp),
        date: new Date(timestamp).toUTCString(),
        email: email,
        status: status || 'not verified',
    }

    // add scan key (timestamp) to the set of scans
    await client.saddAsync(scansSetKey, scanKey)
    
    // create a hash represented by scan key (timestamp)
    await client.hmsetAsync(scanKey, newScan)
    
    return newScan
}
/**
 * Deletes the Scan object represented by given timetamp.
 */
const deleteScan = async timestamp => {

    const client = redis.getClient()
    const scanKey = `${timestamp}:Scan`

    // remove scan key (timestamp) from the set of scans
    await client.sremAsync(scansSetKey, scanKey)

    // remove a hash represented by scan key (timestamp)
    const result = await client.delAsync(scanKey)

    return result ? true : false    
}

module.exports = {
    getScan,
    getScans,
    createScan,
    deleteScan
}