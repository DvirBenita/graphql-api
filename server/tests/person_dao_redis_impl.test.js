const redis = require('../src/models/impl/redis/redisClient')
const redisPersonDAO = require('../src/models/impl/redis/person_dao_redis_impl')
const keyGenerator = require('../src/models/impl/redis/redisKeyGenerator')

const testSuiteName = 'person_dao_redis_impl'
const testKeyPrefix = `test:${testSuiteName}`

keyGenerator.setPrefix(testKeyPrefix)
const client = redis.getClient()

beforeAll(() => {
    jest.setTimeout(60000)
})

afterEach(async () => {
    const testKeys = await client.keysAsync(`${testKeyPrefix}:*`)
    
    if (testKeys.length > 0)
        await client.delAsync(testKeys)
})

afterAll(() => {
    client.quit()
})

test(`${testSuiteName}: Create person without age`, async () => {

    const person = {
        email: 'martin.albert@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
    }
    const expectedPersonHash = {
        email: 'martin.albert@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: '0'
    }

    await redisPersonDAO.createPerson(person)

    const personKey = keyGenerator.getPersonHashKey(person.email)
    const isMember = await client.sismemberAsync(
        keyGenerator.getPeopleSetKey(),
        personKey
    )
    expect(isMember).toBe(1)

    const personFromRedis = await client.hgetallAsync(personKey)
    expect(personFromRedis).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Create person with age`, async () => {

    const person = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 22
    }
    const expectedPersonHash = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: '22'
    }
 
    await redisPersonDAO.createPerson(person)
    const personKey = keyGenerator.getPersonHashKey(person.email)
    const isMember = await client.sismemberAsync(
        keyGenerator.getPeopleSetKey(),
        personKey
    )
    expect(isMember).toBe(1)

    const personFromRedis = await client.hgetallAsync(personKey)
    expect(personFromRedis).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Create person with duplicate email`, async () => {
    const personOriginal = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 22
    }
    const personDuplicate = {
        email: 'martin@gmail.com',
        firstName: 'Albert',
        lastName: 'Martin',
        department: 'politics',
        age: 66
    }
    const duplicateResult = {
        email: 'Already Exists',
        firstName: 'Already Exists',
        lastName: 'Already Exists',
        department: 'Already Exists',
        age: null
    }
    const expectedPersonHash = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: '22'
    }

    const personCreatedFirst = await redisPersonDAO.createPerson(personOriginal)
    const personCreatedSecond = await redisPersonDAO.createPerson(personDuplicate)

    expect(personCreatedFirst).toEqual(personOriginal)
    expect(personCreatedSecond).toEqual(duplicateResult)

    const personKey = keyGenerator.getPersonHashKey(personOriginal.email)
    const personFromRedis = await client.hgetallAsync(personKey)
    expect(personFromRedis).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Get person with email specified`, async () => {

    const person = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 22
    }
    const expectedPersonHash = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: '22'
    }
    await redisPersonDAO.createPerson(person)

    const personFromDAO = await redisPersonDAO.getPerson(person.email)
    expect(personFromDAO).toEqual(person)

    const personKey = keyGenerator.getPersonHashKey(person.email)
    const personFromRedis = await client.hgetallAsync(personKey)
    expect(personFromRedis).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Get non-existing person with email specified`, async () => {
    
    const personFromDAO = await redisPersonDAO.getPerson('notexisting@none.com')
    expect(personFromDAO).toBe(null)
})

test(`${testSuiteName}: Get person without email specified`, async () => {
    
    const expectedPersonHash = {
        email: 'Not Provided',
        firstName: 'Not Provided',
        lastName: 'Not Provided',
        department: 'Not Provided',
        age: null
    }
    
    const personFromDAO = await redisPersonDAO.getPerson()
    expect(personFromDAO).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Get all people with existing person objects`, async () => {

    const people = [
        {
            email: 'martin@gmail.com',
            firstName: 'Martin',
            lastName: 'Albert',
            department: 'IT',
            age: 22
        }, 
        {
            email: 'peter@gmail.com',
            firstName: 'Peter',
            lastName: 'Albert',
            department: 'civil engineering',
            age: 26
        }
    ]

    for (const person of people) 
        await redisPersonDAO.createPerson(person)
    
    const peopleFromDAO = await redisPersonDAO.getAllPeople()
    expect(peopleFromDAO.length).toEqual(people.length)
    expect(peopleFromDAO).toEqual(people)
})

test(`${testSuiteName}: Get all people with empty person objects`, async () => {

    const people = await redisPersonDAO.getAllPeople()
    expect(people).toEqual([])
})

test(`${testSuiteName}: Update person object`, async () => {

    const person = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 22
    }
    const updatedPerson = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Alberto',
        department: 'IT',
        age: 40
    }

    await redisPersonDAO.createPerson(person)
    await redisPersonDAO.updatePerson(updatedPerson)
    
    const result = await redisPersonDAO.getPerson(person.email)
    expect(result).toEqual(updatedPerson)
})

test(`${testSuiteName}: Delete existing person`, async () => {

    const person = {
        email: 'martin@gmail.com',
        firstName: 'Martin',
        lastName: 'Albert',
        department: 'IT',
        age: 22
    }
    const expectedPersonHash = null

    await redisPersonDAO.createPerson(person)
    const personKey = keyGenerator.getPersonHashKey(person.email)
    const isMember = await client.sismemberAsync(
        keyGenerator.getPeopleSetKey(),
        personKey
    )
    expect(isMember).toBe(1)

    await redisPersonDAO.deletePerson(person.email)
    const isMemberAfterDelete = await client.sismemberAsync(
        keyGenerator.getPeopleSetKey(),
        personKey
    )
    expect(isMemberAfterDelete).toBe(0)

    const deletedPerson = await redisPersonDAO.getPerson(person.email)
    expect(deletedPerson).toEqual(expectedPersonHash)
})

test(`${testSuiteName}: Delete non-existing person`, async () => {

    const nonExistingEmail = 'lorem@lorem.com'
    const nonExistingPerson = await redisPersonDAO.getPerson(nonExistingEmail)
    expect(nonExistingPerson).toEqual(null)

    const personKey = keyGenerator.getPersonHashKey(nonExistingEmail)
    const isMember = await client.sismemberAsync(
        keyGenerator.getPeopleSetKey(),
        personKey
    )
    expect(isMember).toBe(0)

    await redisPersonDAO.deletePerson(nonExistingEmail)

    const nonExistingPersonAfterDelete = await redisPersonDAO.getPerson(nonExistingEmail)
    expect(nonExistingPersonAfterDelete).toEqual(null)
})

test(`${testSuiteName}: Delete all person objects`, async () => {

    const people = [
        {
            email: 'martin@gmail.com',
            firstName: 'Martin',
            lastName: 'Albert',
            department: 'IT',
            age: 22
        }, 
        {
            email: 'peter@gmail.com',
            firstName: 'Peter',
            lastName: 'Albert',
            department: 'civil engineering',
            age: 26
        }
    ]

    for (const person of people) 
        await redisPersonDAO.createPerson(person)
    
    const peopleFromDAO = await redisPersonDAO.getAllPeople()
    expect(peopleFromDAO.length).toEqual(people.length)
    expect(peopleFromDAO).toEqual(people)

    await redisPersonDAO.deleteAllPeople()
    const peopleFromDAOAfterDelete = await redisPersonDAO.getAllPeople()
    expect(peopleFromDAOAfterDelete.length).toEqual(0)
    expect(peopleFromDAOAfterDelete).toEqual([])

})