const { gql } = require('apollo-server-express')

/**
 * Schema for GraphQL Query - to get the objects
 */
const Query = gql`

    scalar Timestamp

    type Query {
        reading(timestamp: String): Reading
        readings: [Reading!]

        person(email: String): Person
        people: [Person!]

        scan(timestamp: String): Scan
        scans(email: String, status: String): [Scan!]
    }

    type Reading {
        timestamp: Timestamp!
        date: String
        value: Int!
    }

    type Person {
        email: String!
        firstName: String!
        lastName: String!
        department: String!
        age: Int
    }

    type Scan {
        timestamp: Timestamp!
        date: String
        email: String!
        status: String
    }
`

/**
 * Schema for GraphQL Mutation - to modify the objects
 */
const Mutation = `
    type Mutation {
        createReading(timestamp: String!, value: Int!): Reading!
        deleteReading(timestamp: String!): Boolean!
        deleteAllReadings: Boolean!
        
        createPerson(email: String!, firstName: String!, lastName: String!, department: String!, age: Int): Person!
        updatePerson(email: String!, firstName: String, lastName: String, department: String, age: Int): Boolean!
        deletePerson(email: String!): Boolean!
        deleteAllPeople: Boolean!

        createScan(timestamp: String!, email: String!, status: String): Scan!
        deleteScan(timestamp: String!): Boolean!
        deleteAllScans: Boolean!
    }
`

const typeDefs = [Query, Mutation]

module.exports = typeDefs