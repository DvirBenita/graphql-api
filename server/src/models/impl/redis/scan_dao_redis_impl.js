const redis = require('./redisClient')
const keyGenerator = require('./redisKeyGenerator')
const _ = require('lodash')

/**
 * Gets the Scan object for a given timestamp.
 */
const getScan = async timestamp => {
    
    if (timestamp === undefined) 
        return {
            timestamp: 0,
            date: 'Timestamp not specified',
            email: 'Timestamp not specified',
            status: 'Timestamp not specified',
        }
    
    timestamp = Number(timestamp)
    const client = redis.getClient()
    const scanKey = keyGenerator.getScanHashKey(timestamp)

    // get a hash represented by a scan key (timestamp)
    const scan = await client.hgetallAsync(scanKey)
    if (scan) 
        scan.timestamp = Number(scan.timestamp)
    
    return scan
}
/**
 * Gets all Scan objects grouped by given arguments.
 */
const getScans = async filter => {

    const client = redis.getClient()
    const scans = []

    // get a set of all scan keys 
    const scanKeys = await client.smembersAsync(keyGenerator.getScansSetKey())

    for (const key of scanKeys) {

        // get a hash represented by key (timestamp) in the set
        const scan = await client.hgetallAsync(key)

        if (scan) {
            scan.timestamp = Number(scan.timestamp)
            scans.push(scan)
        }
    }
    
    if (filter === undefined) {
        if (filter.email && filter.status)
            return _.filter(scans, {email: filter.email, status: filter.status})
        else if (!filter.status)
            return _.filter(scans, {email: filter.email})
        else if (!filter.email)
            return _.filter(scans, {status: filter.status})
    } 

    return scans
}   
/**
 * Creates new Scan object with given arguments.
 */
const createScan = async scan => {

    const timestamp = Number(scan.timestamp)
    const client = redis.getClient()
    const scanKey = keyGenerator.getScanHashKey(timestamp)

    // check duplicates
    if (await client.hgetAsync(scanKey, 'email') !== null)
        return {
            timestamp: 0,
            date: 'Already Exists',
            email: 'Already Exists',
            status: 'Already Exists',
        }

    const newScan = {
        timestamp: timestamp,
        date: new Date(timestamp).toUTCString(),
        email: scan.email,
        status: scan.status || 'not verified',
    }

    // add scan key (timestamp) to the set of scans
    await client.saddAsync(keyGenerator.getScansSetKey(), scanKey)
    
    // create a hash represented by scan key (timestamp)
    await client.hmsetAsync(scanKey, newScan)
    
    return newScan
}
/**
 * Deletes the Scan object represented by given timetamp.
 */
const deleteScan = async timestamp => {

    const client = redis.getClient()
    const scanKey = keyGenerator.getScanHashKey(timestamp)
    keyGenerator.getScanHashKey(timestamp)

    // remove scan key (timestamp) from the set of scans
    await client.sremAsync(keyGenerator.getScansSetKey(), scanKey)

    // remove a hash represented by scan key (timestamp)
    const result = await client.delAsync(scanKey)

    return result ? true : false    
}
/**
 * Deletes all Scan objects.
 */
const deleteAllScans = async timestamp => {

    const client = redis.getClient()

    // get a set of all scan keys 
    const scanKeys = await client.smembersAsync(keyGenerator.getScansSetKey())

    for (const key of scanKeys) {

        // delete hashes represented by key in set
        await client.delAsync(key)

    } 

    // delete whole set of people
    await client.delAsync(scanKeys)

    return true
}

module.exports = {
    getScan,
    getScans,
    createScan,
    deleteScan,
    deleteAllScans,
}