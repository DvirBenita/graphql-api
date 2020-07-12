const daoLoader = require('./daoLoader')

const personImpl = daoLoader.loadDao('person')
const readingImpl = daoLoader.loadDao('reading')
const scanImpl = daoLoader.loadDao('scan')

module.exports = {
    /**
     * Gets the Person object for a given email.
     * @param {string} email - Email representing some person.
     * @returns {Promise} - Promise containing person object.
     */
    getPerson: async email => personImpl.getPerson(email),

    /**
     * Gets all Person objects.
     * @returns {Promise} - Promise containing all person objects.
     */
    getAllPeople: async () => personImpl.getAllPeople(),

    /**
     * Creates new Person object with given attributes.
     * @param {Object} person - Object representing person to be created.
     * @returns {Promise} - Promise containing new person object.
     */
    createPerson: async person => personImpl.createPerson(person),

    /**
     * Updates the Person object with new attributes.
     * @param {Object} person - Object representing person to be updated.
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    updatePerson: async person => personImpl.updatePerson(person),

    /**
     * Deletes the Person object represented by given email.
     * @param {string} email - Email representing some person.
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deletePerson: async email => personImpl.deletePerson(email),

    /**
     * Deletes the Person object represented by given email.
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deleteAllPeople: async () => personImpl.deleteAllPeople(),

    /**
     * Gets the Reading object for a given timestamp.
     * @param {string} timestamp - Timestamp representing reading.
     * @returns {Promise} - Promise containing reading object.
     */
    getReading: async timestamp => readingImpl.getReading(timestamp),

    /**
     * Gets all Reading objects.
     * @returns {Promise} - Promise containing all reading objects.
     */
    getAllReadings: async () => readingImpl.getAllReadings(),

    /**
     * Creates new Reading object with given attributes.
     * @param {Object} reading - Object representing reading to be created.
     * @returns {Promise} - Promise containing new reading object.
     */
    createReading: async reading => readingImpl.createReading(reading),

    /**
     * Deletes the Reading object represented by given timestamp.
     * @param {string} timestamp - Timestamp representing some reading.
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deleteReading: async timestamp => readingImpl.deleteReading(timestamp),

    /**
     * Deletes all Reading objects
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deleteAllReadings: async () => readingImpl.deleteAllReadings(),

    /**
     * Gets the Scan object for a given timestamp.
     * @param {string} timestamp - Timestamp representing scan.
     * @returns {Promise} - Promise containing scan object.
     */
    getScan: async timestamp => scanImpl.getScan(timestamp),

    /**
     * Gets all Scan objects grouped by given arguments.
     * @param {Object} filter - Object containing email or status field to filter scan objects
     * @returns {Promise} - Promise containing scan objects.
     */
    getScans: async filter => scanImpl.getScans(filter),

    /**
     * Creates new Scan object with given arguments.
     * @param {Object} scan - Object representing scan to be created.
     * @returns {Promise} - Promise containing new scan object.
     */
    createScan: async scan => scanImpl.createScan(scan),

    /**
     * Deletes the Scan object represented by given timetamp.
     * @param {string} timestamp - Timestamp representing some reading.
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deleteScan: async timestamp => scanImpl.deleteScan(timestamp),

    /**
     * Deletes all Scan objects
     * @returns {Promise} - Promise indicating the operation has completed.
     */
    deleteAllScans: async () => scanImpl.deleteAllScans(),
}
