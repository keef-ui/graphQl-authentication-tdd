const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors= require('cors')
const bodyParser = require('body-parser')
// const typeDefs = require("./schema");
// const resolvers = require("./resolvers");
const db = require('./sequelize')


//  * * * * * * * * * * * * * * Start express server  * * * * * * * * * * * * * *

const typeDefs = `
  type Item {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Query {
    items: [Item]!
    item (id: ID!): Item
    status: String 
  }
  type Mutation {
    createItem(text: String): Item!
    updateItem(id: ID!, done:Boolean!): Item
    deleteItem(id: ID!): Item
    deleteDoneItems: [Item]
    resetItems:[Item]
  }
  `;

const resolvers = {
  Query: {
    items: (parent, args, { db }, info) => db.Item.findAll(),
    item: (parent, { id }, { db }, info) => db.Item.findById(id),
    status: () => "GrpahQL status: OK",
  },
  Mutation: {
    createItem: (parent, { text}, { db }, info) =>
      db.Item.create({
        text: text
      }),
    updateItem: (parent, { id,done}, { db }, info) =>
      db.Item.update({
        done: done
      },
      {
        where: {
          id: id
        },returning: true,
  plain: true
      }).then(function(instance){
          // instance = null if row has not been deleted
          console.log("insta>");
        }),
    deleteItem: (parent, {id}, { db }, info) =>
      db.Item.destroy({
        where: {
          id: id
        }
      }).then(function(instance){
          // instance = null if row has not been deleted
          console.log('instance = null if row has not been deleted');
        }),
    deleteDoneItems: (parent, {},{ db }, info) =>
      db.Item.destroy({
        where: {
          done: true
        }
      }).then(function(instance){
          // instance = null if row has not been deleted
          console.log('instance = null if row has not been deleted');
        }),
    resetItems: (parent, {},{ db }, info) =>
      db.Item.destroy({
         where: {},
          truncate: true
      }).then(function(instance){
          // instance = null if row has not been deleted
          console.log('instance = null if row has not been deleted');
        })
  }
};

const server = new ApolloServer({
  typeDefs: gql(typeDefs),
  resolvers,
  context: { db }
});

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Hello World!')
})

app.use(Cors());

server.applyMiddleware({ app, path: '/graphql' });

// app.use(express.static("app/public"));



//snippet
// server.applyMiddleware({ app, path: '/graphql' });

// app.listen({ port: 8000 }, () => {
//   console.log('Apollo Server on http://localhost:8000/graphql');
// });

module.exports=app;