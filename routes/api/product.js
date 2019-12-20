const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const path = require('path');
const fs = require('fs');
    
// Route to add product
router.post('/add', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    const { name, description, prices, picture, category } = req.body;
    // Get all products
    Product.find({ name })
        .then(products => {
            if (products.length === 0) {
                const newProduct = new Product({
                    name,
                    description,
                    prices,
                    picture,
                    category,
                });
                newProduct.save().then(doc => {
                    if (doc) {
                        return res.status(200).json({
                            success: true,
                            doc
                        });
                    }
                    else {
                        return res.status(500).json({
                            success: false,
                            messages: 'Something went wrong with saving the product'

                        })
                    }
                })
                    .catch(err => {
                        return res.status(500).json({
                            success: false,
                            message: err,
                        });
                    });
            }
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                message: err,
            });
        });
});

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

// Route to delete product
router.delete('/', (req, res) => {
    // Delete product
    Product
        .deleteOne({ _id: req.body.productId })
        .then(product => {
            const path = req.workingDirectory + "/public" + req.body.picture;

            try {
                fs.unlinkSync(path);
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: err,
                });
            }

            return res.status(200).json({
                success: true,
                product
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