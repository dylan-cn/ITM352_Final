const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    size: {
        type: String,
    },
});

module.exports = User = mongoose.model('user', UserSchema);