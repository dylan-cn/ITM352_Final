const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const User = require('../../models/User');

// Route to checkout
router.post('/', async (req, res) => {
    const { order, location, selectedDate } = req.body;

    // Get user from id
    User
        .findOne({ _id: req.id })
        .then((user) => {
            const { firstName, lastName, email, username, phoneNumber } = user;
            // put order into database
            const newOrder = new Order({
                firstName,
                lastName,
                username,
                email,
                phoneNumber,
                order,
                location,
                pickup: selectedDate
            });

            // save order into database
            newOrder.save()
                .then(() => {
                    return res.status(200).json({
                        success: true
                    });
                })
                .catch((err) => {
                    //console.log(err);
                    return res.status(500).json({
                        success: false,
                        messages: err
                    });
                });
        })
        .catch(err => {
            //console.log(err);
            return res.status(500).json({
                success: false,
                messages: 'Invalid user'
            });
        });
});

module.exports = router;