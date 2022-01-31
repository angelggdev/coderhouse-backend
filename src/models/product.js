const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, require: true },
    price: { type: Number, require: true },
    thumbnail: { type: String, require: true }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;