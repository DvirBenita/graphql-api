const redis = require('../src/models/impl/redis/redisClient')
const redisReadingDAO = require('../src/models/impl/redis/reading_dao_redis_impl')
const keyGenerator = require('../src/models/impl/redis/redisKeyGenerator')

const testSuiteName = 'reading_dao_redis_impl'
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

it(`${testSuiteName}: Create`, async () => {

    const reading = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        value: 40
    }
    const expectedReadingHash = { // from redis
        timestamp: reading.timestamp.toString(),
        date: reading.date,
        value: '40'
    }

    const createdReading = await redisReadingDAO.createReading(reading)
    const readingKey = keyGenerator.getReadingHashKey(reading.timestamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getReadingsSetKey(),
        readingKey
    )
    const readingFromRedis = await client.hgetallAsync(readingKey)
    
    expect(isMember).toBe(1)
    expect(createdReading).toEqual(reading)
    expect(readingFromRedis).toEqual(expectedReadingHash)
})

it(`${testSuiteName}: Create a reading with duplicate timestamp`, async () => {

    const readingOriginal = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        value: 40
    }
    const readingDuplicate = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        value: 40
    }
    const duplicateResult = {
        timestamp: 0,
        date: 'Already Exists',
        value: 0
    }
    const expectedReadingHash = { // from redis
        timestamp: readingOriginal.timestamp.toString(),
        date: readingOriginal.date,
        value: '40'
    }

    const readingCreatedFirst = await redisReadingDAO.createReading(readingOriginal)
    const readingCreatedSecond = await redisReadingDAO.createReading(readingDuplicate)
    
    expect(readingCreatedFirst).toEqual(readingOriginal)
    expect(readingCreatedSecond).toEqual(duplicateResult)

    const readingKey = keyGenerator.getReadingHashKey(readingOriginal.timestamp)
    const readingFromRedis = await client.hgetallAsync(readingKey)
    expect(readingFromRedis).toEqual(expectedReadingHash)
})

test(`${testSuiteName}: Get existing reading with timestamp specified`, async () => {

    const reading = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        value: 170
    }
    const expectedReadingHash = { // from redis
        timestamp: reading.timestamp.toString(),
        date: reading.date,
        value: '170'
    }

    await redisReadingDAO.createReading(reading)

    const readingFromDAO = await redisReadingDAO.getReading(reading.timestamp)
    expect(readingFromDAO).toEqual(reading)

    const readingKey = keyGenerator.getReadingHashKey(reading.timestamp)
    const readingFromRedis = await client.hgetallAsync(readingKey)
    expect(readingFromRedis).toEqual(expectedReadingHash)
})

test(`${testSuiteName}: Get non-existing reading with timestamp specified`, async () => {

    const readingFromDAO = await redisReadingDAO.getReading('00000')
    expect(readingFromDAO).toEqual(null)
})

test(`${testSuiteName}: Get reading without timestamp specified`, async () => {
    
    const expectedReadingHash = {
        timestamp: 0,
        date: 'Timestamp not specified',
        value: 0
    }
    
    const readingFromDAO = await redisReadingDAO.getReading()
    expect(readingFromDAO).toEqual(expectedReadingHash)
})

test(`${testSuiteName}: Get all readings with existing reading objects`, async () => {

    const readings = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            value: -20
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            value: 170
        }
    ]

    for (const reading of readings){
        await redisReadingDAO.createReading(reading)

        const readingKey = keyGenerator.getReadingHashKey(reading.timestamp)
        const isMember = await client.sismemberAsync(
            keyGenerator.getReadingsSetKey(),
            readingKey
        )

        expect(isMember).toBe(1)
    }

    const readingsFromDAO = await redisReadingDAO.getAllReadings()
    expect(readingsFromDAO.length).toEqual(readings.length)
})

test(`${testSuiteName}: Get all readings with empty reading objects`, async () => {

    const readings = await redisReadingDAO.getAllReadings()
    expect(readings).toEqual([])
})

test(`${testSuiteName}: Delete existing reading`, async () => {

    const reading = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        value: 170
    }
    const expectedReadingHash = null

    await redisReadingDAO.createReading(reading)
    const readingKey = keyGenerator.getReadingHashKey(reading.timestamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getReadingsSetKey(),
        readingKey
    )
    expect(isMember).toBe(1)

    await redisReadingDAO.deleteReading(reading.timestamp)
    const isMemberAfterDelete = await client.sismemberAsync(
        keyGenerator.getReadingsSetKey(),
        readingKey
    )
    expect(isMemberAfterDelete).toBe(0)

    const deletedReading = await redisReadingDAO.getReading(reading.timestamp)
    expect(deletedReading).toEqual(expectedReadingHash)
})

test(`${testSuiteName}: Delete non-existing reading`, async () => {

    const nonExistingTimeStamp = '00000'
    const nonExistingReading = await redisReadingDAO.getReading(nonExistingTimeStamp)
    expect(nonExistingReading).toEqual(null)

    const readingKey = keyGenerator.getReadingHashKey(nonExistingTimeStamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getReadingsSetKey(),
        readingKey
    )
    expect(isMember).toBe(0)

    await redisReadingDAO.deleteReading(nonExistingTimeStamp)
    const nonExistingReadingAfterDelete = await redisReadingDAO.getReading(nonExistingTimeStamp)
    expect(nonExistingReadingAfterDelete).toEqual(null)
})

test(`${testSuiteName}: Delete all reading objects`, async () => {

    const readings = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            value: -20
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            value: 170
        }
    ]
    const result = []

    for (const reading of readings){
        await redisReadingDAO.createReading(reading)

        const readingKey = keyGenerator.getReadingHashKey(reading.timestamp)
        const isMember = await client.sismemberAsync(
            keyGenerator.getReadingsSetKey(),
            readingKey
        )
        
        expect(isMember).toBe(1)
    }

    const readingsFromDAO = await redisReadingDAO.getAllReadings()
    expect(readingsFromDAO.length).toEqual(readings.length)

    await redisReadingDAO.deleteAllReadings()
    const readingsFromDAOAfterDelete = await redisReadingDAO.getAllReadings()
    expect(readingsFromDAOAfterDelete.length).toEqual(0)
    expect(readingsFromDAOAfterDelete).toEqual([])
})