const daoLoader = require('./daoLoader');

const personImpl = daoLoader.loadDao('person')
const readingImpl = daoLoader.loadDao('reading')
const scanImpl = daoLoader.loadDao('scan')

module.exports = {
    /**
     * Gets the Person object for a given email.
     */
    getPerson: async email => personImpl.getPerson(email),
    
    /**
     * Gets all Person objects.
     */
    getAllPeople: async () => personImpl.getAllPeople(),

    /**
     * Creates new Person object with given attributes.
     */
    createPerson: async person => 
        personImpl.createPerson(person),

    /**
     * Updates the Person object with new attributes.
     */
    updatePerson: async person =>
        personImpl.updatePerson(person),

    /**
     * Deletes the Person object represented by given email.
     */
    deletePerson: async email => personImpl.deletePerson(email),

    /**
     * Deletes the Person object represented by given email.
     */
    deleteAllPeople: async () => personImpl.deleteAllPeople(),


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
    createReading: async reading => readingImpl.createReading(reading),

    /**
     * Deletes the Reading object represented by given email.
     */
    deleteReading: async timestamp => readingImpl.deleteReading(timestamp),

    /**
     * Deletes all Reading objects
     */
    deleteAllReadings: async () => readingImpl.deleteAllReadings(),

    /**
     * Gets the Scan object for a given timestamp.
     */
    getScan: async timestamp => scanImpl.getScan(timestamp),

    /**
     * Gets all Scan objects grouped by given arguments.
     */
    getScans: async filter => scanImpl.getScans(filter),

    /**
     * Creates new Scan object with given arguments.
     */
    createScan: async scan => scanImpl.createScan(scan),

    /**
     * Deletes the Scan object represented by given timetamp.
     */
    deleteScan: async timestamp => scanImpl.deleteScan(timestamp),

    /**
     * Deletes all Scan objects
     */
    deleteAllScans: async () => scanImpl.deleteAllScans(),
}