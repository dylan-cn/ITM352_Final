const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

// Admin Gets all orders
router.get('/', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    // Get all orders
    Order.find()
        .then(orders => {
            console.log(orders);
            return res.status(200).json({
                success: true,
                orders
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
});

// Gets all user orders
router.get('/userorders', (req, res) => {
    // Get all orders, filtered by username (unique key)
    Order.find({ username: req.username })
        .then(orders => {
            return res.status(200).json({
                success: true,
                orders
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
});

// Update order
router.put('/', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    const { _id, status } = req.body;

    // Find user by id
    Order.find({ _id })
        .then(doc => {
            if (doc.length === 1) {
                // Set and save document
                let updatedOrder = doc[0];
                updatedOrder.finished = status;
                updatedOrder.save()
                    .then((newDoc) => {
                        return res.status(200).json({
                            success: true,
                            order: newDoc
                        });
                    })
                    .catch(err => {
                        return res.status(500).json({
                            success: false,
                            message: 'Could not save order',
                        });
                    });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Could not find order',
                });
            }
        })
        .catch(err => {
            console.log("err: " + err)
            return res.status(500).json({
                success: false,
                message: 'Something went wrong with the database trying to update order',
            });
        })
});

module.exports = router;