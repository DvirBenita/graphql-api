const express = require('express')
const morgan = require('morgan')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const models = require('./models')

/**
 * Instance of Express server
 */
const app = express()

/**
 * Create an instance of ApolloServer for GraphQL api
 * 
 * @argument {Array} typeDefs - Array of two types of queries to GraphQL - Query and Mutation
 * @argument {Object} resolvers - Object consisting of handler functions for queries from GraphQL
 * @argument {Object} models - Object that groups all Data Access Object functions
 * 
 */
const server = new ApolloServer({
    typeDefs,
	resolvers,
	context: {
		models
	},
    playground: {
        endpoint: '/graphql',
        settings: {
            'editor.theme': 'dark'
        }
    }
})

/**
 * Apply morgan logger middleware
 * 
 * for more formats : https://www.npmjs.com/package/morgan#predefined-formats
 * 
 */
app.use(morgan('dev'))

/**
 * Set some default headers for upcoming communication.
 * 
 * Ensure CORS is possible - Access-Control-Allow-Origin header
 * 
 */
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
	
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
		return res.status(200).json({})
	}
	next()
})

// Server homepage http://127.0.0.1/
app.get('/', (req, res) => {
	res.status(200).send('Hello World!')
})  

/**
 * Connect ApolloServer to Express
 */
server.applyMiddleware({
	app, 
	path: '/graphql'
})

module.exports = app