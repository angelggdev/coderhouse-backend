const mongoose = require('mongoose');

const ProductInCartSchema = new mongoose.Schema({
    productId: {type: String, require: true},
    quantity: {type: Number, require: true}
})

const CartSchema = new mongoose.Schema({
    timestamp: {type: Number, require: true},
    products: [ProductInCartSchema]
})

const Cart = mongoose.model('cart', CartSchema);
module.exports = {Cart};