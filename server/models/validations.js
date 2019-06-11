const validator = require('validator');

var passwordValidate = [
    {
        validator: (password) => {
            return password.length >= 4;
        },
        message: props => `The password: ${props.value} is not valid. Must have more than 4 characters`
    },
    {
        validator: (password) => {
            return !(validator.isNumeric(password) || validator.isAlpha(password));
        },
        message: () => `The password must contain numbers and characters`
    },
]

var emailValidate = [
    {
        validator: (email) => {
            return validator.isEmail(email);
        },
        message: (props) => `The ${props.value} email is not valid`
    },
]

module.exports = {
    passwordValidate,
    emailValidate
};