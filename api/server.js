const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors= require('cors')
const bodyParser = require('body-parser')

const db = require('./sequelize')


//  * * * * * * * * * * * * * * Start express server  * * * * * * * * * * * * * *

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }
  type Query {
    status: String 
  }
  type Mutation {
    createUser(name:String,email:String,password:String): User!
  }
  `;
const resolvers = {
    Query: {
      status: () => 'GraphQL status: OK'
    },
    Mutation: {
      createUser: (parent, { name,email,password}, { db }, info) => { 
        //check for missing arguments
        if (!name) throw new Error("Name not recieved");
        if (!email) throw new Error("Email not recieved");
        if (!password) throw new Error("Password not recieved");
        return (
              db.User.create({
                name: name,
                email:email,
                password:password
              }))
       }
    }

  }

const server = new ApolloServer({
    typeDefs: gql(typeDefs),
    resolvers,
    context: { db }
});

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Api server setup')
})

app.use(Cors());

server.applyMiddleware({ app, path: '/graphql' });


module.exports=app;