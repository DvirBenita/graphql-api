const shortId = require('shortid')

// Prefix that all keys will start with, taken from process.env
let prefix = process.env.REDIS_PREFIX

/**
 * Takes a string containing a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.  Prefix is configured in config.json.
 * 
 * @param {string} key - a Redis key
 * @returns {string} a Redis key with the application prefix prepended to the value of 'key'
 */
const getKey = key => `${prefix}:${key}`

/**
 * Generates a temporary unique key name using a the short string
 * generator module shortid.
 * 
 * @returns {string} a temporary key of the form tmp:PPBqWA9
 */
const getTemporaryKey = () => getKey(`tmp:${shortId.generate()}`)

/**
 * Takes an email and returns the person key value for that ID (email).
 *
 * Key name: prefix:person:info:[email]
 * Redis type stored at this key: hash
 *
 * @param {string} email - the ID of a person.
 * @returns {string} the person key for the provided person ID.
 */
const getPersonHashKey = email => getKey(`person:info:${email}`)

/**
 * Returns the Redis key name used for the set storing all Person IDs (emails).
 *
 * Key name: prefix:people:ids
 * Redis type stored at this key: set
 *
 * @returns {string} the Redis key name used for the set storing all person IDs.
 */
const getPeopleSetKey = () => getKey('people:ids')

/**
 * Takes an timestamp and returns the reading key value for that ID (timestamp).
 *
 * Key name: prefix:reading:info:[timestamp]
 * Redis type stored at this key: hash
 *
 * @param {string} timestamp - the ID of a reading
 * @returns {string} the reading key for the provided reading ID.
 */
const getReadingHashKey = timestamp => getKey(`reading:info:${timestamp}`)

/**
 * Returns the Redis key name used for the set storing all Reading IDs (timestamps).
 *
 * Key name: prefix:readings:ids
 * Redis type stored at this key: set
 *
 * @returns {string} the Redis key name used for the set storing all reading IDs.
 */
const getReadingsSetKey = () => getKey('readings:ids')

/**
 * Takes an timestamp and returns the scan key value for that ID (timestamp).
 *
 * Key name: prefix:scan:info:[timestamp]
 * Redis type stored at this key: hash
 *
 * @param {string} timestamp - the ID of a scan
 * @returns {string} the scan key for the provided scan ID.
 */
const getScanHashKey = timestamp => getKey(`scan:info:${timestamp}`)

/**
 * Returns the Redis key name used for the set storing all Scan IDs (timestamps).
 *
 * Key name: prefix:scans:ids
 * Redis type stored at this key: set
 *
 * @returns {string} the Redis key name used for the set storing all scan IDs.
 */
const getScansSetKey = () => getKey('scans:ids')

/**
 * Set the global key prefix, overriding the one set in process.env.
 *
 * This is used by the test suites so that test keys do not overlap
 * with real application keys and can be safely deleted afterwards.
 *
 * @param {*} newPrefix - the new key prefix to use.
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