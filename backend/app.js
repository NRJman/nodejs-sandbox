const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');
const mongodbPassword = require('./../sensitive-data/mongodb-password');
const app = express();

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

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>The home server page!</h1>');
});

app.get('/api/posts', (req, res, next) => {
    const promisedFind = Post.find().exec();

    promisedFind
        .then((posts) => {
            res.status(200).json({
                message: 'Successfully fetched the posts!',
                posts
            });
        })
        .catch((error) => {
            console.log('Failed to get instance of posts collection: ', error);
        });
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    
    console.log(post);
    post.save();

    res.status(201).json({ message: 'Successfully created the post!' });
});

app.delete('/api/posts/:id', (req, res, next) => {
    const targetId = req.params.id;
    const promisedDeleteOne = Post.deleteOne({ _id: targetId }).exec();

    promisedDeleteOne
        .then((data) => {
            console.log(data);

            res.status(200).json({
                message: 'Successfully deleted the post!',
                id: targetId
            });
        })
        .catch((error) => {
            console.log('Failed to delete the specified post:', error);
        });
});

app.patch('/api/posts/:id', (req, res, next) => {
    const targetId = req.params.id;
    const newTitle = req.body.title;
    const newContent = req.body.content; 
    const promisedUpdateOne = Post.updateOne({ _id: targetId }, { title: newTitle, content: newContent}).exec();

    promisedUpdateOne
        .then((data) => {
            console.log(data);
        
            res.status(200).json({
                message: 'Successfully updated the post!',
                id: targetId,
                title: newTitle,
                content: newContent
            });
        })
        .catch((error) => {
            console.log('Failed to update the specified post:', error);
        });
});

module.exports = app;
