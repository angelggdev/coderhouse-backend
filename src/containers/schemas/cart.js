const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductInCartSchema = new Schema({
    productId: {type: String, require: true},
    quantity: {type: String, require: true}
})

const CartSchema = new mongoose.Schema({
    timestamp: {type: Number, require: true},
    child: ProductInCartSchema
})

const ProductInCart = mongoose.model('ProductInCart', ProductInCartSchema);
const Cart = mongoose.model('cart', CartSchema);
module.exports = {ProductInCart, Cart};