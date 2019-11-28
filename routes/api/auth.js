const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwtSecret = require('../../config/secrets').jwtSecret;
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

router.post('/', (req, res) => {
    let { username, password } = req.body;

    // Check that all fields are entered
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: ['All fields must be entered']
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
                jwt.sign({ id: existingUser.id }, jwtSecret, (err, token) => {
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