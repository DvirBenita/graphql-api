module.exports = {
    PORT: process.env.PORT || 3000,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    CURRENT_DATABASE: process.env.CURRENT_DATABASE || 'redis',
    REDIS_PREFIX: process.env.REDIS_PREFIX || 'em2',
    JWT_SECRET: process.env.JWT_SECRET || 'secret123',
    GRAPHQLAPI: process.env.GRAPHQLAPI || 'grapql-api',
}
