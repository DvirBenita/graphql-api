const GraphQLTimestamp = require('./GraphQLTimestamp')

let readingsList = {
    1591643927103: {
        timestamp: new Date(1591643927103),
        date: new Date(1591643927103).toUTCString(),
        reading: 25
    },
    1591644336681: {
        timestamp: new Date(1591644336681),
        date: new Date(1591644336681).toUTCString(),
        reading: -100
    }
}

let peopleList = {
    'martin.albert@gmail.com': {
        email: 'martin.albert@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 21
    },
    'peter.albert@gmail.com': {
        email: 'peter.albert@gmail.com',
        firstName: 'Peter',
        lastName: 'Albert',
        department: 'Civil Engineering',
        age: 25
    },
}

const resolvers = {
    Timestamp: GraphQLTimestamp,
    Query: {
        reading: (parent, { timestamp }) => {
            let currentT = Date.now()
            let currentD = new Date(currentT).toUTCString()

            if (timestamp !== undefined)
                return readingsList[Number(timestamp)]
            else 
                return {
                    timestamp: currentT,
                    date: currentD,
                    reading: 0,
                }
        },

        readings: () => Object.values(readingsList),

        me: (parent, args, { email }) => peopleList[email],

        person: (parent, { email }) => {
            if (email !== undefined)
                return peopleList[email]
            else 
                return {
                    email: 'Not Provided',
                    firstName: 'Not Provided',
                    lastName: 'Not Provided',
                    department: 'Not Provided',
                }
        },

        people: () => Object.values(peopleList)
    },
    Mutation: {
        createReading: (parent, {timestamp, reading}, { email }) => {
            timestamp = Number(timestamp)
            const newReading = {
                timestamp: new Date(timestamp),
                date: new Date(timestamp).toUTCString(),
                reading: reading
            }
            readingsList[timestamp] = newReading
            return newReading
        }
    }
}

module.exports = resolvers