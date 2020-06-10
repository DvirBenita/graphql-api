const redis = require('../src/models/impl/redis/redisClient')
const redisScanDAO = require('../src/models/impl/redis/scan_dao_redis_impl')
const keyGenerator = require('../src/models/impl/redis/redisKeyGenerator')

const testSuiteName = 'scan_dao_redis_impl'
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

test(`${testSuiteName}: Create`, async () => {
    
    const scan = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        email: 'martin@gmail.com',
        status: 'verified'
    }
    const expectedScanHash = { // from redis
        timestamp: scan.timestamp.toString(),
        date: scan.date,
        email: 'martin@gmail.com',
        status: 'verified'
    }
    
    const createdScan = await redisScanDAO.createScan(scan)
    const scanKey = keyGenerator.getScanHashKey(scan.timestamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getScansSetKey(),
        scanKey
    )
    const scanFromRedis = await client.hgetallAsync(scanKey)

    expect(isMember).toBe(1)
    expect(createdScan).toEqual(scan)
    expect(scanFromRedis).toEqual(expectedScanHash)
})

test(`${testSuiteName}: Create a scan with duplicate timestamp`, async () => {
    
    const scanOriginal = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        email: 'martin@gmail.com',
        status: 'verified'
    }
    const scanDuplicate = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        email: 'peter@gmail.com',
        status: 'verified'
    }
    const duplicateResult = {
        timestamp: 0,
        date: 'Already Exists',
        email: 'Already Exists',
        status: 'Already Exists'
    }
    const expectedScanHash = { // from redis
        timestamp: Date.now().toString(),
        date: new Date(Date.now()).toUTCString(),
        email: 'martin@gmail.com',
        status: 'verified'
    }

    const scanCreatedFirst = await redisScanDAO.createScan(scanOriginal)
    const scanCreatedSecond = await redisScanDAO.createScan(scanDuplicate)
    
    expect(scanCreatedFirst).toEqual(scanOriginal)
    expect(scanCreatedSecond).toEqual(duplicateResult)

    const scanKey = keyGenerator.getScanHashKey(scanOriginal.timestamp)
    const scanFromRedis = await client.hgetallAsync(scanKey)
    expect(scanFromRedis).toEqual(expectedScanHash)
})

test(`${testSuiteName}: Get existing scan with timestamp specified`, async () => {
    const scan = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        email: 'martin@gmail.com',
        status: 'verified'
    }
    const expectedScanHash = { // from redis
        timestamp: scan.timestamp.toString(),
        date: scan.date,
        email: 'martin@gmail.com',
        status: 'verified'
    }
    
    await redisScanDAO.createScan(scan)

    const scanFromDAO = await redisScanDAO.getScan(scan.timestamp)
    expect(scanFromDAO).toEqual(scan)

    const scanKey = keyGenerator.getScanHashKey(scan.timestamp)
    const scanFromRedis = await client.hgetallAsync(scanKey)
    expect(scanFromRedis).toEqual(expectedScanHash)
})

test(`${testSuiteName}: Get non-existing scan with timestamp specified`, async () => {

    const scanFromDAO = await redisScanDAO.getScan('00000')
    expect(scanFromDAO).toEqual(null)
})

test(`${testSuiteName}: Get scan without timestamp specified`, async () => {
    
    const expectedScanHash = {
        timestamp: 0,
        date: 'Timestamp not specified',
        email: 'Timestamp not specified',
        status: 'Timestamp not specified'
    }

    const scanFromDAO = await redisScanDAO.getScan()
    expect(scanFromDAO).toEqual(expectedScanHash)
})

test(`${testSuiteName}: Get all scans with existing scan objects`, async () => {
    
    const scans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            email: 'peter@gmail.com',
            status: 'not verified'
        }
    ]

    for (const scan of scans) {
        await redisScanDAO.createScan(scan)

        const scanKey = keyGenerator.getScanHashKey(scan.timestamp)
        const isMember = await client.sismemberAsync(
            keyGenerator.getScansSetKey(),
            scanKey
        )

        expect(isMember).toBe(1)
    }

    const scansFromDAO = await redisScanDAO.getScans()
    expect(scansFromDAO.length).toEqual(scans.length)
})

test(`${testSuiteName}: Get all scans with existing scan objects filtering status`, async () => {

    const scans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            email: 'peter@gmail.com',
            status: 'not verified'
        }
    ]
    const expectedScans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        }
    ]

    for (const scan of scans)
        await redisScanDAO.createScan(scan)

    const filter = { status: 'verified' }
    const scansFromDAO = await redisScanDAO.getScans(filter)
    expect(scansFromDAO.length).toEqual(1)
    expect(scansFromDAO).toEqual(expectedScans)
})

test(`${testSuiteName}: Get all scans with existing scan objects filtering emails`, async () => {

    const scans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            email: 'peter@gmail.com',
            status: 'not verified'
        }
    ]
    const expectedScans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        }
    ]

    for (const scan of scans)
        await redisScanDAO.createScan(scan)

    const filter = { email: 'martin@gmail.com' }
    const scansFromDAO = await redisScanDAO.getScans(filter)
    expect(scansFromDAO.length).toEqual(1)
    expect(scansFromDAO).toEqual(expectedScans)
})

test(`${testSuiteName}: Get all scans with existing scan objects filtering emails and status`, async () => {

    const scans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            email: 'peter@gmail.com',
            status: 'not verified'
        },
        {
            timestamp: Date.now()+2,
            date: new Date(Date.now()+2).toUTCString(),
            email: 'martin@gmail.com',
            status: 'not verified'
        }
    ]
    const expectedScans = [
        {
            timestamp: Date.now()+2,
            date: new Date(Date.now()+2).toUTCString(),
            email: 'martin@gmail.com',
            status: 'not verified'
        }
    ]

    for (const scan of scans)
        await redisScanDAO.createScan(scan)

    const filter = { email: 'martin@gmail.com', status: 'not verified' }
    const scansFromDAO = await redisScanDAO.getScans(filter)
    expect(scansFromDAO.length).toEqual(1)
    expect(scansFromDAO).toEqual(expectedScans)
})

test(`${testSuiteName}: Get all scans with empty scan objects`, async () => {
    
    const scans = await redisScanDAO.getScans()
    expect(scans).toEqual([])
})

test(`${testSuiteName}: Delete existing scan`, async () => {

    const scan = {
        timestamp: Date.now(),
        date: new Date(Date.now()).toUTCString(),
        email: 'martin@gmail.com',
        status: 'verified'
    }
    const expectedScanHash = null

    await redisScanDAO.createScan(scan)
    const scanKey = keyGenerator.getScanHashKey(scan.timestamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getScansSetKey(),
        scanKey
    )
    expect(isMember).toBe(1)

    await redisScanDAO.deleteScan(scan.timestamp)
    const isMemberAfterDelete = await client.sismemberAsync(
        keyGenerator.getScansSetKey(),
        scanKey
    )
    expect(isMemberAfterDelete).toBe(0)

    const deletedScan = await redisScanDAO.getScan(scan.timestamp)
    expect(deletedScan).toEqual(expectedScanHash)
})

test(`${testSuiteName}: Delete non-existing scan`, async () => {

    const nonExistingTimeStamp = '00000'
    const nonExistingSccan = await redisScanDAO.getScan(nonExistingTimeStamp)
    expect(nonExistingSccan).toEqual(null)

    const scanKey = keyGenerator.getScanHashKey(nonExistingTimeStamp)
    const isMember = await client.sismemberAsync(
        keyGenerator.getScansSetKey(),
        scanKey
    )
    expect(isMember).toBe(0)

    await redisScanDAO.deleteScan(nonExistingTimeStamp)
    const nonExistingSccanAfterDelete = await redisScanDAO.getScan(nonExistingTimeStamp)
    expect(nonExistingSccanAfterDelete).toEqual(null)
})

test(`${testSuiteName}: Delete all scan objects`, async () => {

    const scans = [
        {
            timestamp: Date.now(),
            date: new Date(Date.now()).toUTCString(),
            email: 'martin@gmail.com',
            status: 'verified'
        },
        {
            timestamp: Date.now()+1,
            date: new Date(Date.now()+1).toUTCString(),
            email: 'peter@gmail.com',
            status: 'not verified'
        }
    ]

    for (const scan of scans) {
        await redisScanDAO.createScan(scan)

        const scanKey = keyGenerator.getScanHashKey(scan.timestamp)
        const isMember = await client.sismemberAsync(
            keyGenerator.getScansSetKey(),
            scanKey
        )

        expect(isMember).toBe(1)
    }

    const scansFromDAO = await redisScanDAO.getScans()
    expect(scansFromDAO.length).toEqual(scans.length)

    await redisScanDAO.deleteAllScans()
    const scansFromDAOAfterDelete = await redisScanDAO.getScans()
    expect(scansFromDAOAfterDelete.length).toEqual(0)
    expect(scansFromDAOAfterDelete).toEqual([])
})