const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');
const boom = require('boom');
require('dotenv').config();

passport.use(
    new Strategy(
    {
        secretOrKey: process.env.AUTH_JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }
    , async ( { email } , callback) => {
        try {
            email = email.toLowerCase();
            const user = await User.findOne({ email });
            
            if (!user) {
                return callback(boom.unauthorized("El correo electrónico no esta asociado a nuestro servicio"), false)
            }
            return callback(null, user);
        } catch (error) {
            return callback(error);
        }
    })
)