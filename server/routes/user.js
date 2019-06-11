const User = require('../models/user');
const passport = require('passport');
const express = require('express');
require('../passport/basic');
const jwt = require('jsonwebtoken');

const userRoutes = express.Router();

const createToken = (user) => jwt.sign({ id:user._id, email: user.email }, process.env.AUTH_JWT_SECRET, { expiresIn: '1d' })

// api/auth/register
userRoutes.post('/register',
async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        const token = createToken(user);

        res.status(200).json({user, token});
    } catch (error) {
        console.log('error: ', error);
        res.json(error);
    }
});

// api/auth/login
userRoutes.post('/login', async (req, res, next) => {
    passport.authenticate('basic', { session: false }, async(error, user) => {
        try {
            if (error) {
                var {output:{payload:{message}}} = error;
                return res.json({error:message})
            }

            const token = createToken(user);

            res.status(200).json({user, token});
        } catch (error) {
            res.json(error);
        }
    })(req, res, next)
})


module.exports = userRoutes;