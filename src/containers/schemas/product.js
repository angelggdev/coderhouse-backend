const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {type: String, require: true},
    price: {type: Number, require: true},
    thumbnail: {type: String, require: true},
    description: {type: String, require: true},
    stock: {type: Number, require: true},
    timestamp: {type: Number, require: true},
})

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;