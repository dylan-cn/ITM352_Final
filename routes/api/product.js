const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Gets all users
router.post('/add', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
const{name, description, prices, picture} = req.body;
    // Get all products
    Product.find({name})
        .then(products => {
            if (products.length === 0 ){
                const newProduct = new Product({
                    name, 
                    description, 
                    prices,
                    picture
                });
                newProduct.save().then(doc=>{
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

module.exports = router;