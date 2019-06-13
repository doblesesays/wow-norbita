const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcryptjs = require('bcryptjs');
const {
    passwordValidate, emailValidate
} = require('./validations');


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: [true, 'The email is already registered'],
        index: true,
        validate: emailValidate,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        validate: passwordValidate,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
}, { timestamps: true })

// Validating the unique property attributes
UserSchema.plugin(uniqueValidator);

// To return the User object without the password attribute
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
}

// once the validations were passed and BEFORE saving:
UserSchema.post('validate', (user) => {
    // Password is encrypted
    user.password = bcryptjs.hashSync(user.password, 10);

    // lowercase the email
    user.email = user.email.toLowerCase();
});

module.exports = mongoose.model('User', UserSchema);