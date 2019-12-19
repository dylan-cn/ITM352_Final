const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    order: {
        type: Array,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    finished: {
        type: Boolean,
        default: false 
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('order', OrderSchema);