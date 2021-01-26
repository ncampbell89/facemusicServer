const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    signup: (params) => {
        return new Promise((resolve, reject) => {

            User.findOne({email: params.email})
            .then(user => {

                if(user) {
                    let errors = {}
                    errors.message = 'Email already exists. Please log in.'
                    errors.status = 409
                    reject(errors)

                } else {
                    const newUser = new User({
                        firstName: params.firstName,
                        lastName: params.lastName,
                        email: params.email,
                        password: params.password,
                        gender: params.gender
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) {
                                throw err
                            } else {
                                newUser.password = hash;
                                newUser.save()
                                .then(user => resolve(user))
                                .catch(err => reject(err));
                            }
                        })
                    })
                }
            })
            .catch(err => {
                console.log(err)
                reject(err)
            });
        })
    },

    signin: (params) => {

        return new Promise((resolve, reject) => {
            // Check to see if the username is in our database
            User.findOne({email: params.email})
            .then(user => {
              
                if(!user) {
                    let errors = {}
                    errors.message = 'Email does not exist in our database. Please sign up.'
                    errors.status = 404
                    reject(errors)
                } else {
                    bcrypt.compare(params.password, user.password)
                    .then(isMatch => {
                        console.log(isMatch);
                        if(isMatch) {
                            const payload = {
                                id: user._id,
                                email: user.email
                            }
                            
                            // console.log(payload)
                            // console.log(process.env.SECRET_KEY);

                            // sign up with the information in the login 
                            // form and the secret key along with the JSON web token

                            // determine when does the token expire

                            // if there's an error with the token
                                // reject error
                            // else 
                                // Token given. Success confirmation = true

                            jwt.sign(payload, process.env.SECRET_KEY, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) {
                                    console.log('error')
                                    reject(err)
                                } else {
                                    console.log('success')
                                    let success = {};
                                    success.confirmation = true;
                                    success.token = `Bearer ${token}`;
                                    resolve(success);
                                }
                            })

                        } else {
                            console.log('no match')
                            let errors = {};
                            errors.message = 'Passwords do not match';
                            errors.status = 400;
                            console.log(errors)
                            reject(errors);
                        }
                    })
                    .catch(error => reject(error));
                }
            })
            .catch(error => reject(error));
        })
    },

    login: (params) => {
        return new Promise((resolve, reject) => {
            // Check to see if the email is in our database
            User.findOne({ email: params.email }, (err, user) => {
                // If the user was not found, reject the promise
                if(err) {
                    reject(err);
                } else {
                    bcrypt.compare(params.password, user.password, (err, result) => {
                        // If there is an error, reject the promise
                        if(err) {
                            reject(err)
                        } else {
                            // The result is the result of the comparison. 
                            // If it is true, the passwords match. 
                            // If it false, the passwords do not match
                            if(result) {
                                const payload = {
                                    id: user._id,
                                    email: user.email
                                }
                                jwt.sign(payload, process.env.SECRET_KEY, {
                                    expiresIn: 3600
                                }, (err, token) => {
                                    if(err) {
                                        console.log('error')
                                        reject(err)
                                    } else {
                                        console.log('success')
                                        let success = {};
                                        success.confirmation = true;
                                        success.token = `Bearer ${token}`;
                                        resolve(success);
                                    }
                                })
                                resolve(result)
                            } else {
                                reject(err)
                            }
                        }
                    })
                }
            })
        })
    }

                ///// params //////
                // { firstName: 'James',
                //   lastName: 'Johnson',
                //   email: 'jjohnson@yahoo.com',
                //   password: 'test',
                //   password2: 'fdsvc',
                //   gender: 'male',
                //   error: null,
                //   errorMessage: '',
                //   signedUp: true,
                //   signedIn: null,
                //   genres: [] }

                ///// user ///////
                // { firstName: 'Myles',
                //   lastName: 'Campbell',
                //   email: 'mcampbell@gmail.com',
                //   password:
                //    '$2a$10$KcVUSsVF8SyigO0lzE.SK.6nyYZggQ9R5jo57xA71QGqbCJRJchA6',
                //   gender: 'male',
                //   genres: [],
                //   _id: 5c72cdcef300b003b95e81a9,
                //   timestamp: 'Sunday, February 24th 2019, 12:01:02 pm',
                //   __v: 0 }
}
