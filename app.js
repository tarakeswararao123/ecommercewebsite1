const mysql = require('mysql')
const express = require('express')
const app = express()
const cors = require('cors'); 
const db = require('./dbconnection')
const users = require('./src/users');
const products= require('./src/product')
const ratings = require('./src/reviewand ratings')
const morgan =require('morgan')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json());

app.use('/users',users)
app.use('/product',products)
app.use('/rating',ratings)


module.exports = app