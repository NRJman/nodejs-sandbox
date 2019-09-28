const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodbPassword = require('./../sensitive-data/mongodb-password');
const app = express();
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

mongoose.connect(`mongodb+srv://vadym:${mongodbPassword}@cluster0-lrab3.mongodb.net/nodejs-sandbox?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to a db!');
    })
    .catch(() => {
        console.log('Failed to connect to a db');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );

    next();
});

app.use('/images', express.static('backend/images'));
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>The home server page!</h1>');
});


module.exports = app;
