const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');

router.post('/', (req, res, next) => {
    let user;

    bcrypt.hash(req.body.password, 10)
        .then(hashedPassword => {
            user = new User({
                email: req.body.email,
                password: hashedPassword
            })

            return user.save();
        })
        .then(() => {
            res.status(201).json({
                message: 'Successfully created the user!',
                user
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error
            });
        })
});

module.exports = router;