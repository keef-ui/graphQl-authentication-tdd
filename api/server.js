const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors = require('cors')
// const bodyParser = require('body-parser')

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
    createUser: async (parent, { name, email, password }, { db }, info) => {
      const emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


      //check for missing arguments
      if (!name) throw new Error("Name not recieved");
      if (!email) throw new Error("Email not recieved");
      if (!password) throw new Error("Password not recieved");
      // General validation
      if (name.length > 15) throw new Error("Name should be less than 15 characters");
      //Email and password check
      const isValidEmail = emailExpression.test(String(email).toLowerCase());
      if (!isValidEmail) throw new Error("Email is not valid")
      if (password.length < 8) throw new Error("Password should be minimum 8 characters")
      let countNames= await db.User.count({ where: { name: name } });
      if (countNames>0) throw new Error("Name already exists");
      let countEmails= await db.User.count({ where: { email: email} });
      if (countEmails>0) throw new Error("Email already exists")
      return (
        db.User.create({
          name: name,
          email: email,
          password: password
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


module.exports = app;