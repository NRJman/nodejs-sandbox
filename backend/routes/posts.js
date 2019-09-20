const express = require('express');
const router = express.Router();
const Post = require('./../models/post');
const multer = require('multer');
const MIME_TYPES_MAP = {
    'image/png': 'png',
    'image/gif': 'gif',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
};


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let error = null;

        if (!(file.mimetype in MIME_TYPES_MAP)) {
            error = new Error('Invalid mimetype!');
        }

        callback(error, 'backend/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');

        callback(null, Date.now() + '-' + name);
    }
});

router.get('', (req, res, next) => {
    const promisedFind = Post.find().exec();
    const { currentPageIndex, pageSize, firstPostIdOnCurrentPage } = req.params;
    const pageIndexesDifference = currentPageIndex - req.params.targetPageIndex;

    promisedFind
        .then((posts) => {
            const formattedPosts = {};
            
            for (let i = 0, len = posts.length; i < len; i++) {
                formattedPosts[posts[i]._id] = {
                    title: posts[i].title,
                    content: posts[i].content,
                    imageSrc: posts[i].imageSrc
                };
            }

            res.status(200).json({
                message: 'Successfully fetched the posts!',
                posts: formattedPosts
            });
        })
        .catch((error) => {
            console.log('Failed to get instance of posts collection: ', error);
        });
});

router.get('/count', (req, res, next) => {
    Post.estimatedDocumentCount().then(postsListLength => {
        res.status(200).json({
            message: 'Successfully fetched the number of posts!',
            postsListLength
        });
    })
});

router.post('', multer({ storage }).single('image'), (req, res, next) => {
    const serverUrl = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageSrc: serverUrl + '/images/' + req.file.filename
    });
    
    console.log(post);
    post.save();

    res.status(201).json({ 
        message: 'Successfully created the post!',
        id: post._id,
        post: {
            title: post.title,
            content: post.content,
            imageSrc: post.imageSrc
        }
    });
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

router.patch('/:id', multer({ storage }).single('image'), (req, res, next) => {
    const targetId = req.params.id;
    const fieldsToUpdate = req.body;
    let promisedUpdateOne;

    if (req.file) {
        const serverUrl = req.protocol + '://' + req.get('host');

        fieldsToUpdate.imageSrc = serverUrl + '/images/' + req.file.filename;
    }

    promisedUpdateOne = Post.updateOne({ _id: targetId }, { ...fieldsToUpdate }).exec();

    promisedUpdateOne
        .then((data) => {
            console.log('The post has been updated: ', data);

            res.status(200).json({
                message: 'Successfully updated the post!',
                id: targetId,
                postUpdated: {
                    ...fieldsToUpdate
                }
            });
        })
        .catch((error) => {
            console.log('Failed to update the specified post:', error);
        });
});

module.exports = router;