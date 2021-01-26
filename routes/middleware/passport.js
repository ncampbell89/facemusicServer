const passport = require('passport');
const localStrategy = require('passport-local');
const JWTStrategy = require('passport-jwt').Strategy;

const userController = require('../controllers/userController');
const { jsonSecret } = require('../config/keys');

// The strategy takes in the fields it will look for to authenticate a user, 
//then the method it will authenticate a user with.

passport.use(
    new localStrategy(
        {
            emailField: 'email',
            passwordField: 'password'
        },
        (email, password, done) => {
            userController.login({ email, password })
            .then(result => {
                done(null, result, { message: 'Logged In Sucessfully!' });
            })
            .catch(error => {
                done(null, false, { message: 'Password does not match.' });
            })
        }
    )
);

const getCookie = req => {
    return req.cookies.jwt;
}

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: getCookie,
            secretOrKey: jsonSecret
        },
        (jwtPayload, callback) => {
            callback(null, jwtPayload.email)
        }
    )
);

module.exports = passport;
