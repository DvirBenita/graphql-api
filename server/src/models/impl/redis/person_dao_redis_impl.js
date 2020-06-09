const redis = require('./redisClient');
const _ = require('lodash')

const peopleSetKey = 'People:Set'

/**
 * Gets the Person object for a given email.
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
    const personKey = `${email}:Person`

    // get a hash represented by a person key (email)
    return await client.hgetallAsync(personKey)
}
/**
 * Gets all Person objects.
 */
const getAllPeople = async () => {

    const client = redis.getClient()
    const people = []

    // get a set of all person keys 
    const personKeys = await client.smembersAsync(peopleSetKey)

    for (const key of personKeys) {

        // get a hash represented by key (email) in the set
        const person = await client.hgetallAsync(key)

        if (person)
            people.push(person)
    }

    return people
}
/**
 * Creates new Person object with given attributes.
 */
const createPerson = async (email, firstName, lastName, department, age) => {

    const client = redis.getClient()
    const personKey = `${email}:Person`

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
        email: email,
        firstName: firstName,
        lastName: lastName,
        department: department,
        age: age || 0
    }

    // add a person key (email) to the set of people
    await client.saddAsync(peopleSetKey, personKey)

    // create a hash represented by person key (email)
    await client.hmsetAsync(personKey, newPerson)

    return newPerson
}
/**
 * Updates the Person object with new attributes.
 */
const updatePerson = async (email, firstName, lastName, department, age) => {

    const client = redis.getClient()
    const personKey = `${email}:Person`

    const newAttrs = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        department: department,
        age: age
    }

    // get a current hash represented by key (email)
    const oldPerson = await client.hgetallAsync(personKey)
    const updatedPerson = {}

    // update only new attributes
    _.forEach(oldPerson, (attr, key) => {
        if (newAttrs[key] === undefined || newAttrs[key] === attr)
            updatedPerson[key] = attr
        else 
            updatedPerson[key] = newAttrs[key]
    })
    
    // update a hash represented by person key (email) with new attributes
    const result = await client.hmsetAsync(personKey, updatedPerson)
    
    return result === 'OK' ? true : false
}
/**
 * Deletes the Person object represented by given email.
 */
const deletePerson = async email => {
    const client = redis.getClient()
    const personKey = `${email}:Person`

    // remove person key (email) from the set of people
    await client.sremAsync(peopleSetKey, personKey)

    // remove a hash represented by person key (email)
    const result = await client.delAsync(personKey)
    
    return result ? true : false    
}

module.exports = {
    getPerson,
    getAllPeople,
    createPerson,
    updatePerson,
    deletePerson,
}