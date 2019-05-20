const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors= require('cors')
const bodyParser = require('body-parser')
// const typeDefs = require("./schema");
// const resolvers = require("./resolvers");
const db = require('./sequelize')

// * * * * *  ^^^ * * * * * * * * * Bring the MODELS  * * * * * * * * * * * * * *

// npm init --> setup
// packages to install -- npm install --save body-parser express mysql2 sequelize
// Add nodemon to 

//mkdir models
//touch ./models/user.js ./models/blog.js ./models/tag.js
//touch sequelize.js 
//touch index.js
// GraphQl example : https://github.com/infocentric/graphqlApiNodeDemo/blob/master/server.js
// https://medium.com/infocentric/setup-a-graphql-api-with-apollo-2-0-sequelize-and-express-js-608d1365d776
// Setup appolo server for graphql 

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

// const app = express()

// app.use(Cors());

// app.use(bodyParser.json());

//  * * * * * * * * * * * * * * A P I routes * * * * * * * * * * * * * *
// test in insomia ->post-> json -> {"text":"my item 3","done":true}

// // create a item
// app.post('/api/items', (req, res) => {
//     Item.create(req.body)
//         .then(item => res.json(item))
// })

// // get all item
// app.get('/api/items', (req, res) => {
//     Item.findAll(
// {attributes: ['text','done','id']}
//       ).then(items => res.json(items))
// })

// // get all item
// app.post('/api/add_items', (req, res) => {
// Item.update({
//     text: req.body.text,    
//     done: false

// }, {
//     where: {
//         id: req.body.id
//     }
// })
// })

// // update  done item
// app.post('/api/done_items', (req, res) => {
// Item.update({   
//     done: req.body.done

// }, {
//     where: {
//         id: req.body.id
//     }
// }).then(items => res.json(items))
// })


// // get all done items
// app.get('/api/done_items', (req, res) => {
// Item.findAll({
//   attributes: ['id'],
//   where: {
//     done: false
//       }
//     }).then(items => res.json(items))
// })


// // Delete all done items
// app.delete('/api/delete_done_items', (req, res) => {
// Item.destroy({
//   where: {
//     done: 1
//       }
//     }).then(items => res.json(items))
// })

// // Delete all items
// app.delete('/api/delete_items', (req, res) => {
// Item.destroy( {
//   where: {},
//   truncate: true
// }).then(items => res.json(items))
// })

const app = express()

app.use(Cors());

server.applyMiddleware({ app, path: '/graphql' });

// app.use(express.static("app/public"));

//Listen to port
const port = 3000
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}/graphql`)
})


//snippet
// server.applyMiddleware({ app, path: '/graphql' });

// app.listen({ port: 8000 }, () => {
//   console.log('Apollo Server on http://localhost:8000/graphql');
// });