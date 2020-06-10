const sampleData = require('./sampleData')

/**
 * Gets the GraphQL mutation query for creating Reading record.
 * 
 * JSON is returned only if value of this reading is positive ( 25 and more ) or negative ( -10 or less )
 * 
 * @param {Number} pivot - number for calculating variables used in returning mutation query
 * @returns {string} record represented in JSON string or empty string.
 * 
 */
const getReading = (pivot) => {

    // calculate the variables
    const timestamp = Date.now().toString()
    const value = Math.floor( Math.random() * (pivot-60) )

    // create a mutation query
    const query = `mutation createReading($timestamp: String!, $value: Int!) { 
        createReading(timestamp: $timestamp, value: $value) {
            timestamp
            date
            value
        }
    }`

    if (value > 25 || value < -10)
        return JSON.stringify(
            {
                query,
                variables: {
                    timestamp,
                    value
                }
            }
        )
    else 
        return ''
}

/**
 * Gets the GraphQL mutation query for creating Scan record.
 * 
 * Email is choosen from ./sampleData.js module.
 * 
 * @param {Number} pivot - number for calculating variables used in returning mutation query
 * @returns {string} record represented in JSON string
 * 
 */
const getScan = (pivot) => {

    // calculate the variables
    const timestamp = Date.now().toString()
    const email = sampleData[pivot % 4]
    const status = pivot % 2 ? 'verified' : 'not verified'

    // create a mutation query
    const query = `mutation createScan($timestamp: String!, $email: String!, $status: String) { 
        createScan(timestamp: $timestamp, email: $email, status: $status) {
            timestamp
            date
            email
            status
        }
    }`

    return JSON.stringify(
        { 
            query,
            variables:{
                timestamp,
                email,
                status,
            }
        }
    )
}

module.exports = {
    getReading,
    getScan
}