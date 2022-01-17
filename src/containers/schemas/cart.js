const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    timestamp: {type: Number, require: true},
    products: []
})

const Cart = mongoose.model('cart', CartSchema);
module.exports = {Cart};