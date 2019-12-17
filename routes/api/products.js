const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Route to get all products
router.get('/', (req, res) => {
    // Get all products from database
    Product
        .find()
        .then(products => {
            return res.status(200).json({
                success: true,
                products
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
});

module.exports = router;