const mongoose = require('mongoose');
const Product = require('../models/product');
const {API_URL} = require('../../util');

class ProductContainer {
    constructor(collection) {
        this.rta = mongoose.connect(API_URL);
    }

    async saveProduct(item) {
        const product = new Product(item);
        try {
            await product.save();
            return 'se agregó el producto exitosamente';
        } catch (err) {
            return { error: err };
        }
    }

    async updateProduct(item) {
        let product;
        try {
            product = (await Product.find({ _id: item.id }))[0];
        } catch (err) {
            return {
                error: `no se encontró un producto con el id ${item.id}`,
            };
        }
        let _item = Object.fromEntries(
            Object.entries(item).filter(([_, v]) => v !== null)
        );
        Object.assign(product, _item);
        await Product.updateOne({ _id: item.id }, { $set: { ...product } });
        return `se actualizó el producto con id ${item.id}`;
    }

    async getById(id) {
        try {
            return await Product.find({ _id: id });
        } catch (err) {
            return null;
        }
    }

    async getAll() {
        try {
            const products = await Product.find();
            if (products.length > 0) {
                return products;
            } else {
                return [];
            }
        } catch (err) {
            return { error: err };
        }
    }

    async deleteById(id) {
        try {
            const product = await Product.find({ _id: id });
            await Product.deleteOne({ _id: id });
            return `se ha eliminado el producto con id ${id}`;
        } catch (err) {
            return {
                error: `no se encontró un producto con el id ${id}`,
            };
        }
    }

}

module.exports = ProductContainer;