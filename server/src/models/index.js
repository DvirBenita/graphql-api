const daoLoader = require('./daoLoader');

const personImpl = daoLoader.loadDao('person')
const readingImpl = daoLoader.loadDao('reading')

module.exports = {
    /**
     * Returns timestamp and UTC String of actual Time
     */
    getPerson: async email => personImpl.getPerson(email),
    
    /**
     * Gets all Person objects.
     */
    getAllPeople: async () => personImpl.getAllPeople(),

    /**
     * Creates new Person object with given attributes.
     */
    createPerson: async (email, firstName, lastName, department, age) => 
        personImpl.createPerson(email, firstName, lastName, department, age),

    /**
     * Updates the Person object with new attributes.
     */
    updatePerson: async (email, firstName, lastName, department, age) =>
        personImpl.updatePerson(email, firstName, lastName, department, age),

    /**
     * Deletes the Person object represented by given email.
     */
    deletePerson: async email => personImpl.deletePerson(email),


    /**
     * Gets the Reading object for a given timestamp.
     */
    getReading: async timestamp => readingImpl.getReading(timestamp),

    /**
     * Gets all Reading objects.
     */
    getAllReadings: async () => readingImpl.getAllReadings(),

    /**
     * Creates new Reading object with given attributes.
     */
    createReading: async (timestamp, reading) => readingImpl.createReading(timestamp, reading),

    /**
     * Deletes the Reading object represented by given email.
     */
    deleteReading: async timestamp => readingImpl.deleteReading(timestamp),
}