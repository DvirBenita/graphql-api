const GraphQLTimestamp = require('./GraphQLTimestamp')

const resolvers = {
    Timestamp: GraphQLTimestamp,
    Query: {
        reading: (parent, { timestamp }, { models }) => models.getReading(timestamp),

        readings: (parent, args, { models }) => models.getAllReadings(),

        person: (parent, { email }, { models }) => models.getPerson(email),

        people: (parent, args, { models }) => models.getAllPeople(),

        scan: (parent, { timestamp }, { models }) => models.getScan(timestamp),

        scans: (parent, { email, status }, { models }) => models.getScans(email, status)
    },

    Mutation: {
        createReading: (parent, { timestamp, reading }, { models }) => models.createReading(timestamp, reading),
        
        deleteReading: (parent, { timestamp }, { models }) => models.deleteReading(timestamp),

        createPerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.createPerson(email, firstName, lastName, department, age),
        
        deletePerson: (parent, { email }, { models }) => models.deletePerson(email),

        updatePerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.updatePerson(email, firstName, lastName, department, age),

        createScan: (parent, { timestamp, email, status }, { models }) => models.createScan(timestamp, email, status),

        deleteScan: (parent, { timestamp }, { models }) => models.deleteScan(timestamp),
    }
}

module.exports = resolvers