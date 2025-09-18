const express = require('express');
const app = express();

const requestLogger = require('./middleware/request-logger');
const apiRouter = require('./routes'); 

app.use(express.json());

app.use(...requestLogger);


app.use('/api', apiRouter);

module.exports = app;
