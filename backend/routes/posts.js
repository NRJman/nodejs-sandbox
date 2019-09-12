const express = require('express');
const router = express.Router();
const Post = require('./../models/post');

router.get('', (req, res, next) => {
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

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    
    console.log(post);
    post.save();

    res.status(201).json({ message: 'Successfully created the post!' });
});

router.delete('/:id', (req, res, next) => {
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

router.patch('/:id', (req, res, next) => {
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

module.exports = router;