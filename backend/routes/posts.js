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
//      const extension = MIME_TYPES_MAP[file.mimetype];

        callback(null, Date.now() + '-' + name);
    }
});

router.get('', (req, res, next) => {
    const promisedFind = Post.find().exec();

    promisedFind
        .then((posts) => {            
            res.status(200).json({
                message: 'Successfully fetched the posts!',
                posts: posts.map((post) => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content,
                        imageSrc: post.imageSrc
                    }
                })
            });
        })
        .catch((error) => {
            console.log('Failed to get instance of posts collection: ', error);
        });
});

router.post('', multer({ storage }).single('image'), (req, res, next) => {
    const serverUrl = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imageSrc: serverUrl + '/images/' + req.file.filename
    });
    
    console.log(req.file.filename);
    console.log(post);
    post.save();

    res.status(201).json({ 
        message: 'Successfully created the post!',
        post: {
            id: post._id,
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
                post: {
                    id: targetId,
                    title: newTitle,
                    content: newContent
                }
            });
        })
        .catch((error) => {
            console.log('Failed to update the specified post:', error);
        });
});

module.exports = router;