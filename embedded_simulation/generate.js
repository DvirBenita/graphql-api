const sampleData = require('./sampleData')

const getReading = (pivot) => {

    const timestamp = Date.now().toString()
    const reading = Math.floor(Math.random() * (pivot-60))
    const query = `mutation createReading($timestamp: String!, $reading: Int!) { 
        createReading(timestamp: $timestamp, reading: $reading) {
            timestamp
            date
            reading
        }
    }`

    if (reading > 25 || reading < -10)
        return JSON.stringify(
            {
                query,
                variables: {
                    timestamp,
                    reading
                }
            }
        )
    else 
        return false
}

const getScan = (pivot) => {

    const timestamp = Date.now().toString()
    const email = sampleData[pivot % 4]
    const status = pivot % 2 ? 'verified' : 'not verified'
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