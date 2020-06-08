const GraphQLTimestamp = require('./GraphQLTimestamp')
const CURRENT_TIMESTAMP = Date.now()
const CURRENT_DATE = new Date(CURRENT_TIMESTAMP).toUTCString()

const resolvers = {
    Timestamp: GraphQLTimestamp,
    Query: {
        reading: (parent, { timestamp }, { models }) => {

            if (timestamp !== undefined)
                return models.readingsList[Number(timestamp)]
            else 
                return {
                    timestamp: CURRENT_TIMESTAMP,
                    date: CURRENT_DATE,
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

            // checking duplicates
            if (models.readingsList[timestamp] !== undefined)
                return {
                    timestamp: CURRENT_TIMESTAMP,
                    date: CURRENT_DATE,
                    reading: 0,
                }

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
        },

        createPerson: (parent, { email, firstName, lastName, department, age }, { models }) => {
            
            // checking duplicates
            if (models.peopleList[email] !== undefined) 
                return {
                    email: 'Not Provided',
                    firstName: 'Not Provided',
                    lastName: 'Not Provided',
                    department: 'Not Provided',
                }
            
            const newPerson = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                department: department,
                age: age
            }

            models.peopleList[email] = newPerson
            return newPerson
        },
        deletePerson: (parent, { email }, { models }) => {

            const { [email]: person, ...otherPeople } = models.peopleList
            
            if (!person)
                return false
            
            models.peopleList = otherPeople
            return true
        },
        updatePerson: (parent, { email, firstName, lastName, department, age }, { models }) => {
            
            if (models.peopleList[email] === undefined) 
                return false

            const updatedPerson = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                department: department,
                age: age
            }

            models.peopleList[email] = updatedPerson
            return true
        }
    }
}

module.exports = resolvers