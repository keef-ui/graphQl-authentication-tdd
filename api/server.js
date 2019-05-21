const express = require('express')
const { ApolloServer, gql } = require("apollo-server-express");
const Cors= require('cors')
const bodyParser = require('body-parser')

const db = require('./sequelize')


//  * * * * * * * * * * * * * * Start express server  * * * * * * * * * * * * * *

const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Api server setup')
})

app.use(Cors());



module.exports=app;