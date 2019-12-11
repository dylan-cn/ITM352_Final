const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwtSecret = require('../../config/secrets').jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    // Check that all fields are entered
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            messages: ['All fields must be entered']
        });
    }

    let success = false;
    let messages = [];

    // Username and email are unique... so find if any
    // of thos exist in database
    User.findOne({ username })
        .then(existingUser => {
            if (!existingUser) {
                return res.status(400).json({
                    success,
                    messages: ['Invalid credentials: username or password is incorrect']
                })
            }

            // Validate password from hash
            let passwordValidation = bcrypt.compareSync(password, existingUser.password);
            if (passwordValidation) {
                // assign jwt to user
                const role = existingUser.role || 'user';
                jwt.sign({ id: existingUser.id, role }, jwtSecret, (err, token) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            messages: [err]
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        messages,
                        user: {
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            username,
                            email: existingUser.email
                        },
                        token
                    });
                });
            } else {
                return res.status(400).json({
                    success: false,
                    messages: ["Invalid credentials: username or password is incorrect"]
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                messages: ['Catastrophic error with login system']
            });
        });
});

router.post('/register', (req, res) => {
    let { firstName, lastName, username, password, passwordConfirm, email } = req.body;

    // Check that all fields are entered
    if (!firstName || !lastName || !username || !password || !passwordConfirm || !email) {
        return res.status(400).json({
            success: false,
            messages: {
                general: 'All fields must be entered'
            }
        });
    }

    // Trim all the fields to get rid all white space
    firstName = firstName.trim();
    lastName = lastName.trim();
    username = username.trim().toLowerCase();
    password = password.trim();
    passwordConfirm = passwordConfirm.trim();
    email = email.trim();

    let success = false;
    let messages = {};

    // Username and email are unique... so find if any
    // of thos exist in database
    User.findOne({ $or: [{ email }, { username }] })
        .then(existingUser => {
            // new user object
            const newUser = new User({
                firstName,
                lastName,
                username,
                password,
                email
            });

            // User or email exists
            if (existingUser) {
                if (existingUser.email === email) {
                    messages.email = 'E-mail is already in use!';
                }

                if (existingUser.username === username) {
                    messages.username = 'Username already exists!';
                }
            } else {
                // Validation
                if (password !== passwordConfirm) {
                    messages.password = 'Passwords do not match';
                }

                if (!emailRegex.test(email)) {
                    messages.email = 'Email format is invalid';
                }

                // If object is empty at this point, then there were no errors
                if (Object.keys(messages).length === 0 && messages.constructor === Object) {
                    try {
                        // Salt and hash the password
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(password, salt);

                        newUser.password = hash;

                        success = true;
                    } catch (err) {
                        messages.general = "Error creating account: password";
                    }
                }
            }

            // Check to see if can add user to database or not
            // Return status to client
            if (success) {
                // Save user to database
                newUser.save().then(user => {
                    const role = user.role || 'user';
                    jwt.sign({ id: user.id, role }, jwtSecret, (err, token) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                messages: {
                                    general: err
                                }
                            });
                        }

                        return res.status(200).json({
                            success,
                            messages: {
                                general: 'Successfully created account'
                            },
                            user: {
                                firstName,
                                lastName,
                                username,
                                email
                            },
                            token
                        });
                    });
                }).catch(err => {
                    return res.status(500).json({
                        success,
                        messages: {
                            general: 'Catastrophic error trying to save account to database'
                        }
                    });
                });
            } else {
                return res.status(400).json({
                    success,
                    messages
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                success,
                messages: {
                    general: 'Catastrophic error trying to create account'
                }
            });
        });
});

router.post('/verify', (req, res) => {
    const token = req.headers['x-auth-token'];

    // try to decode token
    if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            res.json({
                success: true,
                message: 'Token is validated'
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: 'Bad token'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'No token provided'
        })
    }
});


module.exports = router;