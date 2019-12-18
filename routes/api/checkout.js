const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const User = require('../../models/User');

// Route to get all products
router.post('/', async (req, res) => {
    const { id, order } = req.body;

    console.log('asdasd');
    console.log(order)

    // Get user from id
    User
        .find({ _id: id })
        .then((user) => {
            console.log(user);
                const { firstName, lastName, email, username, phoneNumber } = user;
                // put order into database
                const newOrder = new Order({
                    firstName,
                    lastName,
                    username,
                    email,
                    phoneNumber,
                    order
                });

                // save order into database
                newOrder.save()
                    .then(() => {
                        return res.status(200).json({
                            success: true
                        });
                    })
                    .catch((err) => {
                        //console.log(err)
                        return res.status(500).json({
                            success: false,
                            messages: err
                        });
                    });
            }
        )
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                success: false,
                messages: err
            });
        });
});

module.exports = router;