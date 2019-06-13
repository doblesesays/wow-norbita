const passport = require('passport')
const { BasicStrategy } = require('passport-http')
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const boom = require('boom');

passport.use(new BasicStrategy(
    async (email, password, callback) => {
        try {
            email = email.toLowerCase();

            const user = await User.findOne({ email }).populate('wishlist');

            if (!user) {
                return callback(boom.unauthorized("El correo electrónico no esta asociado a nuestro servicio"), false)
            }

            if (!(await bcryptjs.compareSync(password, user.password))) {
                return callback(boom.unauthorized("Contraseña incorrecta"), false)
            }

            return callback(null, user)
        } catch (error) {
            return callback(error);
        }
    }
))