// package routes
const express = require('express')
const morgan = require('morgan')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

// making express server
const app = express()

// making apollo server
const server = new ApolloServer({
    typeDefs,
	resolvers,
	context: {
		email: 'martin.albert@gmail.com'
	},
    playground: {
        endpoint: '/graphql',
        settings: {
            'editor.theme': 'dark'
        }
    }
})

// middlewares
app.use(morgan('dev'))

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
app.get('/', (req, res) => {
	res.status(200).send('Hello World!')
})  

server.applyMiddleware({
	app, 
	path: '/graphql'
})

module.exports = app