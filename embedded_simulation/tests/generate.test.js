const { getReading, getScan } = require('../generate')

const testSuiteName = 'generate'
const testKeyPrefix = `test:${testSuiteName}`

beforeAll(() => {
    jest.setTimeout(60000)
})

test(`${testSuiteName}: getReading`, () => {

    const pivot = 21
    const jsonFromGetReading = getReading(pivot)
    expect(typeof jsonFromGetReading).toBe('string')

    if (jsonFromGetReading !== '') {

        expect(jsonFromGetReading).toMatch(/createReading/)
        const parsedReading = JSON.parse(jsonFromGetReading)

        expect(parsedReading).toHaveProperty('variables')
        expect(Object.keys(parsedReading.variables)).toHaveLength(2)

        expect(parsedReading.variables).toHaveProperty('value')
        expect(typeof parsedReading.variables.value).toBe('number')
        
        if (parsedReading.variables.value < 0)
            expect(parsedReading.variables.value).toBeLessThan(-10)
        else
            expect(parsedReading.variables.value).toBeGreaterThan(25)
        

        expect(parsedReading.variables).toHaveProperty('timestamp')
        expect(typeof parsedReading.variables.timestamp).toBe('string')

    } else {

        expect(jsonFromGetReading).toBeFalsy()
    }
})

test(`${testSuiteName}: getScan`, () => {

    const pivot = 21
    const jsonFromGetScan = getScan(pivot)
    expect(typeof jsonFromGetScan).toBe('string')
    expect(jsonFromGetScan).toMatch(/createScan/)

    const parsedScan = JSON.parse(jsonFromGetScan)

    expect(parsedScan).toHaveProperty('variables')
    expect(Object.keys(parsedScan.variables)).toHaveLength(3)

    expect(parsedScan.variables).toHaveProperty('timestamp')
    expect(typeof parsedScan.variables.timestamp).toBe('string')

    expect(parsedScan.variables).toHaveProperty('email')
    expect(typeof parsedScan.variables.email).toBe('string')

    expect(parsedScan.variables).toHaveProperty('status')
    expect(typeof parsedScan.variables.status).toBe('string')
    expect(parsedScan.variables.status).toMatch(/not verified|verified/)

})
