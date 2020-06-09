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

        deleteAllReadings: (parent, args, { models }) => models.deleteAllReadings(),
        
        createPerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.createPerson(email, firstName, lastName, department, age),

        updatePerson: (parent, { email, firstName, lastName, department, age }, { models }) => models.updatePerson(email, firstName, lastName, department, age),
        
        deletePerson: (parent, { email }, { models }) => models.deletePerson(email),

        deleteAllPeople: (parent, args, { models }) => models.deleteAllPeople(),

        createScan: (parent, { timestamp, email, status }, { models }) => models.createScan(timestamp, email, status),

        deleteScan: (parent, { timestamp }, { models }) => models.deleteScan(timestamp),

        deleteAllScans: (parent, args, { models }) => models.deleteAllScans(),
    }
}

module.exports = resolvers