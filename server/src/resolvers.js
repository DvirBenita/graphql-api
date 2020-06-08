const GraphQLTimestamp = require('./GraphQLTimestamp')

const resolvers = {
    Timestamp: GraphQLTimestamp,
    Query: {
        reading: (parent, { timestamp }, { models }) => {
            let currentT = Date.now()
            let currentD = new Date(currentT).toUTCString()

            if (timestamp !== undefined)
                return models.readingsList[Number(timestamp)]
            else 
                return {
                    timestamp: currentT,
                    date: currentD,
                    reading: 0,
                }
        },

        readings: (parent, args, { models }) => Object.values(models.readingsList),

        me: (parent, args, { models, email }) => models.peopleList[email],

        person: (parent, { email }, { models }) => {
            if (email !== undefined)
                return models.peopleList[email]
            else 
                return {
                    email: 'Not Provided',
                    firstName: 'Not Provided',
                    lastName: 'Not Provided',
                    department: 'Not Provided',
                }
        },

        people: (parent, args, { models }) => Object.values(models.peopleList)
    },
    Mutation: {
        createReading: (parent, { timestamp, reading }, { models }) => {
            timestamp = Number(timestamp)
            const newReading = {
                timestamp: new Date(timestamp),
                date: new Date(timestamp).toUTCString(),
                reading: reading
            }
            models.readingsList[timestamp] = newReading
            return newReading
        },
        deleteReading: (parent, { timestamp }, { models }) => {
            timestamp = Number(timestamp)

            const { [timestamp]: reading, ...otherReadings } = models.readingsList
            
            if (!reading)
                return false
            
            models.readingsList = otherReadings
            return true
        }
    }
}

module.exports = resolvers