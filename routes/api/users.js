const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwtSecret = require('../../config/secrets').jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/register', (req, res) => {
    let { firstName, lastName, username, password, passwordConfirm, email } = req.body;

    // Check that all fields are entered
    if (!firstName || !lastName || !username || !password || !passwordConfirm || !email) {
        return res.status(400).json({
            success: false,
            message: ['All fields must be entered']
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
    let messages = [];

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
                    messages.push('E-mail is already in use!');
                } else {
                    messages.push('Username already exists!');
                }
            } else {
                // Validation
                if (password !== passwordConfirm) {
                    messages.push('Passwords do not match');
                }

                if (!emailRegex.test(email)) {
                    messages.push('Email format is invalid');
                }

                // If no messages have been added at this point,
                // it means that it is ok to begin account creation
                if (messages.length === 0) {
                    try {
                        // Salt and hash the password
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(password, salt);

                        newUser.password = hash;

                        success = true;
                        messages.push('Successfully created account');
                    } catch (err) {
                        messages.push("Error creating account: password");
                    }
                }
            }

            // Check to see if can add user to database or not
            // Return status to client
            if (success) {
                // Save user to database
                newUser.save().then(user => {
                    jwt.sign({ id: user.id }, jwtSecret, (err, token) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                messages: [err]
                            });
                        }

                        return res.status(200).json({
                            success,
                            messages,
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
                        messages: ['Catastrophic error trying to save account to database']
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
                messages: ['Catastrophic error trying to create account']
            });
        });
});


module.exports = router;