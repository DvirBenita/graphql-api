const GraphQLTimestamp = require('./GraphQLTimestamp')

const resolvers = {
    
    Timestamp: GraphQLTimestamp,

    Query: {

        reading: (parent, { timestamp }, { models }) => models.getReading(timestamp),

        readings: (parent, args, { models }) => models.getAllReadings(),

        person: (parent, { email }, { models }) => models.getPerson(email),

        people: (parent, args, { models }) => models.getAllPeople(),

        scan: (parent, { timestamp }, { models }) => models.getScan(timestamp),

        scans: (parent, filter, { models }) => models.getScans(filter)

    },

    Mutation: {

        createReading: (parent, reading, { models }) => models.createReading(reading),
        
        deleteReading: (parent, { timestamp }, { models }) => models.deleteReading(timestamp),

        deleteAllReadings: (parent, args, { models }) => models.deleteAllReadings(),
        
        createPerson: (parent, person, { models }) => models.createPerson(person),

        updatePerson: (parent, person, { models }) => models.updatePerson(person),
        
        deletePerson: (parent, { email }, { models }) => models.deletePerson(email),

        deleteAllPeople: (parent, args, { models }) => models.deleteAllPeople(),

        createScan: (parent, scan, { models }) => models.createScan(scan),

        deleteScan: (parent, { timestamp }, { models }) => models.deleteScan(timestamp),

        deleteAllScans: (parent, args, { models }) => models.deleteAllScans(),
        
    }
}

module.exports = resolvers