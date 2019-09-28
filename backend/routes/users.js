const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const jwt = require('jsonwebtoken');

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
                message: error.message
            });
        })
});

router.post('/login/', (req, res, next) => {
    let fetchedUser;
    const promisedFindOne = User.findOne({ email: req.body.email }).exec();

    promisedFindOne
        .then(user => {
            fetchedUser = user;

            if (!user) {
                throw new Error('The email does not exist!');
            }

            return bcrypt.compare(req.body.password, user.password);
        })
        .then(isPasswordCorrect => {
            
            if (!isPasswordCorrect) {
                throw new Error('The password is incorrect!');
            }

            jwt.sign(
                { id: fetchedUser._id, email: fetchedUser.email },
                'Here is a secret key. (possibly should be longer on prod)',
                { expiresIn: '1h' },
                (err, token) => {
                    if (token) {
                        res.status(200).json({
                            message: 'Successfully logged in!',
                            token
                        });

                        return;
                    }

                    throw new Error(err);
                }
            )
        })
        .catch(error => {
            res.status(401).json({
                message: error.message
            })
        })
});

module.exports = router;