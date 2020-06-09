const redis = require('./redisClient');
const _ = require('lodash')

const peopleSetKey = 'People:Set'

/**
 * Returns timestamp and UTC String of actual Time
 */
const getCurrentTime = () => {
    return {
        currentT: Date.now(),
        currentD: new Date(Date.now()).toUTCString()
    }
}

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
    const person = await client.hgetallAsync(personKey)

    return person
}
/**
 * Gets all Person objects.
 */
const getAllPeople = async () => {

    const client = redis.getClient()
    const personKeys = await client.smembersAsync(peopleSetKey)
    const people = []

    for (const key of personKeys) {
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

    // checking duplicates
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

    await client.saddAsync(peopleSetKey, personKey)
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
    const oldPerson = await client.hgetallAsync(personKey)

    const updatedPerson = {}

    _.forEach(oldPerson, (attr, key) => {
        if (newAttrs[key] === undefined || newAttrs[key] === attr)
            updatedPerson[key] = attr
        else 
            updatedPerson[key] = newAttrs[key]
    })

    if (email !== oldPerson['email']){
        await client.sremAsync(peopleSetKey, oldPerson['email'])
        await client.saddAsync(peopleSetKey, personKey)
    }
    
    const result = await client.hmsetAsync(personKey, updatedPerson)
    
    return result === 'OK' ? true : false
}
/**
 * Deletes the Person object represented by given email.
 */
const deletePerson = async email => {
    const client = redis.getClient()
    const personKey = `${email}:Person`

    await client.sremAsync(peopleSetKey, personKey)
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