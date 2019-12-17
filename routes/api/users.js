const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Gets all users
router.get('/', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    // Get all users
    User.find()
        // select only the following fields
        .select(['firstName', 'lastName', 'username', 'role', 'phoneNumber'])
        .then(users => {
            return res.status(200).json({
                success: true,
                users
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
});

// Update user
router.put('/', (req, res) => {

    console.log("in put");
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    const { _id, role } = req.body;

    // Find user by id
    User.find({ _id })
        // select only the following fields
        .select(['firstName', 'lastName', 'username', 'role'])
        .then(doc => {
            if (doc.length === 1) {
                // Set and save document
                let updatedUser = doc[0];
                updatedUser.role = role;
                updatedUser.save()
                    .then((newDoc) => {
                        return res.status(200).json({
                            success: true,
                            user: newDoc
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            success: false,
                            message: 'Could not save user',
                        });
                    });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Could not find user',
                });
            }
        })
        .catch(err => {
            console.log("err: " + err)
            return res.status(500).json({
                success: false,
                message: 'Something went wrong with the database trying to update user',
            });
        })
});

module.exports = router;