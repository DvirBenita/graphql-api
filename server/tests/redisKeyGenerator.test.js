const keyGenerator = require('../src/models/impl/redis/redisKeyGenerator')

const testSuiteName = 'redisKeyGenerator';
const expectedKeyPrefix = 'test';

keyGenerator.setPrefix(expectedKeyPrefix);

test(`${testSuiteName}: getPersonHashKey`, () => {
  expect(keyGenerator.getPersonHashKey('martin@gmail.com')).toBe(`${expectedKeyPrefix}:person:info:martin@gmail.com`);
});

test(`${testSuiteName}: getPeopleSetKey`, () => {
  expect(keyGenerator.getPeopleSetKey()).toBe(`${expectedKeyPrefix}:people:ids`);
});

test(`${testSuiteName}: getReadingHashKey`, () => {
    const timestamp = Date.now()
    console.log('##### Date.now() Timestamp> ####', timestamp)
    expect(keyGenerator.getReadingHashKey(timestamp)).toBe(`${expectedKeyPrefix}:reading:info:${timestamp}`);
});

test(`${testSuiteName}: getReadingsSetKey`, () => {
    expect(keyGenerator.getReadingsSetKey()).toBe(`${expectedKeyPrefix}:readings:ids`);
});

test(`${testSuiteName}: getScanHashKey`, () => {
    const timestamp = Date.now()
    console.log('##### Date.now() Timestamp> ####', timestamp)
    expect(keyGenerator.getScanHashKey(timestamp)).toBe(`${expectedKeyPrefix}:scan:info:${timestamp}`);
});

test(`${testSuiteName}: getScansSetKey`, () => {
    expect(keyGenerator.getScansSetKey()).toBe(`${expectedKeyPrefix}:scans:ids`);
});

test(`${testSuiteName}: setPrefix`, () => {
  expect(keyGenerator.getPeopleSetKey()).toBe(`${expectedKeyPrefix}:people:ids`);
});

test(`${testSuiteName}: getTemporaryKey`, () => {
  const tmpKey = keyGenerator.getTemporaryKey();
  expect(tmpKey.length).toBeGreaterThan(0);
});

