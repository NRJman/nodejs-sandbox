const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('First express interceptor');
    next();
});

app.use((req, res, next) => {
    res.send('The response text!');
});

module.exports = app;
