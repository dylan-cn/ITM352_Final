const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    prices: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    }
});

module.exports = Product = mongoose.model('product', ProductSchema);