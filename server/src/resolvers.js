const GraphQLTimestamp = require('./GraphQLTimestamp')

const resolvers = {
    Timestamp: GraphQLTimestamp,
    Query: {
        reading: (parent, { timestamp }, { models }) => models.getReading(timestamp),

        readings: (parent, args, { models }) => models.getAllReadings(),

        person: (parent, { email }, { models }) => models.getPerson(email),

        people: (parent, args, { models }) => models.getAllPeople()
    },

    Mutation: {
        createReading: (parent, { timestamp, reading }, { models }) => models.createReading(timestamp, reading),
        
        deleteReading: (parent, { timestamp }, { models }) => models.deleteReading(timestamp),

        createPerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.createPerson(email, firstName, lastName, department, age),
        
        deletePerson: (parent, { email }, { models }) => models.deletePerson(email),

        updatePerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.updatePerson(email, firstName, lastName, department, age),
    }
}

module.exports = resolvers