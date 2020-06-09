const shortId = require('shortid')

// Prefix that all keys will start with, taken from process.env
let prefix = process.env.REDIS_PREFIX

/**
 * Takes a string containing a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.  Prefix is configured in config.json.
 */
const getKey = key => `${prefix}:${key}`

/**
 * Generates a temporary unique key name using a the short string
 * generator module shortid.
 */
const getTemporaryKey = () => getKey(`tmp:${shortId.generate()}`)

/**
 * Takes an email and returns the person key value for that ID (email).
 *
 * Key name: prefix:person:info:[email]
 * Redis type stored at this key: hash
 *
 */
const getPersonHashKey = email => getKey(`person:info:${email}`)

/**
 * Returns the Redis key name used for the set storing all Person IDs (emails).
 *
 * Key name: prefix:people:ids
 * Redis type stored at this key: set
 *
 */
const getPeopleSetKey = () => getKey('people:ids')

/**
 * Takes an timestamp and returns the reading key value for that ID (timestamp).
 *
 * Key name: prefix:reading:info:[timestamp]
 * Redis type stored at this key: hash
 *
 */
const getReadingHashKey = timestamp => getKey(`reading:info:${timestamp}`)

/**
 * Returns the Redis key name used for the set storing all Reading IDs (timestamps).
 *
 * Key name: prefix:readings:ids
 * Redis type stored at this key: set
 *
 */
const getReadingsSetKey = () => getKey('readings:ids')

/**
 * Takes an timestamp and returns the scan key value for that ID (timestamp).
 *
 * Key name: prefix:scan:info:[timestamp]
 * Redis type stored at this key: hash
 *
 */
const getScanHashKey = timestamp => getKey(`scan:info:${timestamp}`)

/**
 * Returns the Redis key name used for the set storing all Scan IDs (timestamps).
 *
 * Key name: prefix:scans:ids
 * Redis type stored at this key: set
 *
 */
const getScansSetKey = () => getKey('scans:ids')

/**
 * Set the global key prefix, overriding the one set in process.env.
 *
 * This is used by the test suites so that test keys do not overlap
 * with real application keys and can be safely deleted afterwards.
 *
 */
const setPrefix = (newPrefix) => {
    prefix = newPrefix;
}

module.exports = {
    getTemporaryKey,
    getPersonHashKey,
    getPeopleSetKey,
    getReadingHashKey,
    getReadingsSetKey,
    getScanHashKey,
    getScansSetKey,
    setPrefix,
    getKey,
}