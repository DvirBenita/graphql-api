const sampleData = require('./sampleData')

const getReading = (pivot) => {

    const timestamp = Date.now().toString()
    const value = Math.floor(Math.random() * (pivot-60))
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