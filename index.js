//this is the main starting point of the application

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
//app instance 
const app = express()
const router = require('./router')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true });

//Here goes app setup
//morgan for login incoming request
app.use(morgan("combined"))

//this middleware is used to parse incoming request
app.use(bodyParser.json({type: '*/*'}));
router(app)
//
//Here goes server setup

const PORT = process.env.PORT || 3090;
//server serves incoming http request
const server = http.createServer(app)
server.listen(PORT);
console.log(`Server is listening on port ${PORT}`)