const redis = require('./redisClient')
const keyGenerator = require('./redisKeyGenerator')
const _ = require('lodash')

/**
 * Gets the Person object for a given email.
 * @param {string} email - Email representing some person.
 * @returns {Promise} - Promise containing person object.
 */
const getPerson = async email => {

    if (email === undefined)
        return {
            email: 'Not Provided',
            firstName: 'Not Provided',
            lastName: 'Not Provided',
            department: 'Not Provided',
            age: null
        }

    const client = redis.getClient()
    const personKey = keyGenerator.getPersonHashKey(email)

    // get a hash represented by a person key (email)
    const person = await client.hgetallAsync(personKey)
    if (person)
        person.age = Number(person.age)

    return person
}

/**
 * Gets all Person objects.
 * @returns {Promise} - Promise containing all person objects.
 */
const getAllPeople = async () => {

    const client = redis.getClient()

    // get a set of all person keys 
    const personKeys = await client.smembersAsync(keyGenerator.getPeopleSetKey())

    return personKeys.reduce( async (people, key, index) => {
        
        // get a hash represented by key (email) in the set
        const person = await client.hgetallAsync(key)

        if (person) {
            person.age = Number(person.age)
            people[index] = person
        }

        return people
    }, [])
}

/**
 * Creates new Person object with given attributes.
 * @param {Object} person - Object representing person to be created.
 * @returns {Promise} - Promise containing new person object.
 */
const createPerson = async person => {

    const client = redis.getClient()
    const personKey = keyGenerator.getPersonHashKey(person.email)

    // check duplicates
    if (await client.hgetAsync(personKey, 'email') !== null)
        return {
            email: 'Already Exists',
            firstName: 'Already Exists',
            lastName: 'Already Exists',
            department: 'Already Exists',
            age: null
        }

    const newPerson = {
        email: person.email,
        firstName: person.firstName,
        lastName: person.lastName,
        department: person.department,
        age: person.age || 0
    }

    // add a person key (email) to the set of people
    await client.saddAsync(keyGenerator.getPeopleSetKey(), personKey)

    // create a hash represented by person key (email)
    await client.hmsetAsync(personKey, newPerson)

    return newPerson
}

/**
 * Updates the Person object with new fields.
 * @param {Object} person - Object representing person to be updated.
 * @returns {Promise} - Promise indicating the operation has completed.
 */
const updatePerson = async person => {

    const client = redis.getClient()
    const personKey = keyGenerator.getPersonHashKey(person.email)

    // get a current hash represented by key (email)
    const oldPerson = await client.hgetallAsync(personKey)
    const updatedPerson = {
        email: person.email,
        firstName: person.firstName,
        lastName: person.lastName,
        department: person.department,
        age: person.age
    }

    // update only new fields
    _.forEach(oldPerson, (field, key) => {
        if (updatedPerson[key] === undefined || updatedPerson[key] === field)
            updatedPerson[key] = field
        else 
            updatedPerson[key] = updatedPerson[key]
    })
    
    // update a hash represented by person key (email) with new fields
    const result = await client.hmsetAsync(personKey, updatedPerson)
    
    return result === 'OK' ? true : false
}

/**
 * Deletes the Person object represented by given email.
 * @param {string} email - Email representing some person.
 * @returns {Promise} - Promise indicating the operation has completed.
 */
const deletePerson = async email => {
    const client = redis.getClient()
    const personKey = keyGenerator.getPersonHashKey(email)

    // remove person key (email) from the set of people
    await client.sremAsync(keyGenerator.getPeopleSetKey(), personKey)

    // remove a hash represented by person key (email)
    const result = await client.delAsync(personKey)
    
    return result ? true : false    
}

/**
 * Deletes the Person object represented by given email.
 * @returns {Promise} - Promise indicating the operation has completed.
 */
const deleteAllPeople = async () => {
    const client = redis.getClient()
    
    // get a set of all reading keys 
    const personKeys = await client.smembersAsync(keyGenerator.getPeopleSetKey())

    for (const key of personKeys) {

        // remove hashes represented by keys in set
        await client.delAsync(key)

    }

    // delete whole set of people
    await client.delAsync(keyGenerator.getPeopleSetKey())

    return true
}

module.exports = {
    getPerson,
    getAllPeople,
    createPerson,
    updatePerson,
    deletePerson,
    deleteAllPeople,
}