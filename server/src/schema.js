const { gql } = require('apollo-server-express')


const Query = gql`

    scalar Timestamp

    type Query {
        reading(timestamp: String): Reading
        readings: [Reading!]

        me: Person

        people: [Person!]
        person(email: String): Person
    }

    type Reading {
        timestamp: Timestamp!
        date: String
        reading: Int!
    }

    type Person {
        email: String!
        firstName: String!
        lastName: String!
        department: String!
        age: Int
    }
`

const Mutation = `
    type Mutation {
        createReading(timestamp: String!, reading: Int!): Reading!
        deleteReading(timestamp: String!): Boolean!
        
        createPerson(email: String!, firstName: String!, lastName: String!, department: String!, age: Int): Person!
        deletePerson(email: String!): Boolean!
        updatePerson(email: String!, firstName: String, lastName: String, department: String, age: Int): Boolean!
    }
`

const typeDefs = [Query, Mutation]

module.exports = typeDefs