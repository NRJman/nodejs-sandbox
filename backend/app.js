const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Acess-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );

    next();
});

app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>The home server page!</h1>');
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { title: "First Post", content: "This is the first post's content" },
        { title: "Second Post", content: "This is the second post's content" },
        { title: "Third Post", content: "This is the third post's content" }
    ];

    res.status(200).json({
        message: 'Successfully fetched the posts!',
        posts
    });
});

app.post('/api/posts', (req, res, next) => {
    const body = req.body;
    
    console.log(body);

    res.status(201).json({ message: 'Successfully created the post!' });
});

module.exports = app;
