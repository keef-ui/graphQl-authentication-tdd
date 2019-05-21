const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors= require('cors')
const bodyParser = require('body-parser')

const db = require('./sequelize')


//  * * * * * * * * * * * * * * Start express server  * * * * * * * * * * * * * *

const typeDefs = `
  type Query {
    status: String 
  }
  `
const resolvers = {
    Query: {
      status: () => 'GraphQL status: OK'
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