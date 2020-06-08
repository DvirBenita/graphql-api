// package routes
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { graphqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
})

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())

// Access Control Allow Origin
// Basic Headers
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
app.get('/', function(req, res) {
	res.status(200).send('Hello World!')
})  

// Server GraphQL
app.use('/graphql', graphqlExpress({ schema: myGraphQLSchema }))

module.exports = app
module.exports.schema = schema