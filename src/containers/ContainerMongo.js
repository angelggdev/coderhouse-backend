const mongoose = require('mongoose');
const Product = require('./schemas/product');
const { Cart } = require('./schemas/cart');
const url = require('../utils/mongo-config');

class ContainerMongo {
    constructor(collection) {
        this.rta = mongoose.connect(url);
    }

    /* Product container */

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
        let _item = Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== null ));
        Object.assign(product, _item)
        await Product.updateOne(
            { _id: item.id },
            { $set: { ...product } }
        );
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

    //deletes an Item by its Id
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

    /* Cart Container */

    async createCart() {
        try {
            const cart = new Cart({
                timestamp: Date.now(),
            });
            const cartCreated = await cart.save();
            return `se ha creado un carrito con el id ${cartCreated._id}`;
        } catch (err) {
            return { error: err };
        }
    }

    async getCartProducts(id) {
        try {
            const cart = (await Cart.find({ _id: id }))[0];
            if (cart.products) {
                return cart.products;
            } else {
                return [];
            }
        } catch (err) {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async addProductToCart(id, productId, quantity) {
        let cart;
        try {
            cart = await Cart.findOne({ _id: id });
        } catch (err) {
            return { error: `No se encontró el carrito con id ${id}` };
        }
        const productExists = await this.getById(productId);     
        let productIndex;
        cart.products.forEach((product, i) => {
            product.productId === productId && (productIndex = i);
        });
        if (productIndex !== undefined) {
            cart.products[productIndex].quantity += quantity;
            try {
                await cart.save();
                return `Se ha actualizado el producto con el id ${productId}`;
            } catch (err) {
                return { error: err };
            }
        } else {
            if (productExists) {
                const product = {
                    productId: productId,
                    quantity: quantity,
                };
                cart.products.push(product);
                try {
                    await cart.save();
                    return `Se ha agregado un producto con el id ${productId}`;
                } catch (err) {
                    return { error: err };
                }
            } else {
                return {
                    error: `No se encontró el producto con id ${productId}`,
                };  
            }
        }
            
    }

    async deleteCartProduct(id, productId) {
        let cart;
        try {
            cart = await Cart.findOne({ _id: id });
        } catch (e) {
            return { error: `No se encontró el carrito con id ${id}` };
        }
        let productIndex;
        cart.products.forEach((product, i) => {
            product.productId === productId && (productIndex = i);
        });
        if (productIndex !== undefined) {
            cart.products = cart.products.filter(
                (product) => product.productId !== productId
            );
            try {
                await cart.save();
                return `Se eliminó el producto con id ${productId} del carrito`;
            } catch (err) {
                return { error: err };
            }
        } else {
            return {
                error: `El producto con id ${productId} no se encuentra en el carrito`,
            };
        }  
    }

    async deleteCartById(id) {
        try {
            const cart = await Cart.find({ _id: id });
        } catch (err) {
            return {
                error: `no se encontró un carrito con el id ${id}`,
            };
        }
        await Cart.deleteOne({ _id: id });
        return `se ha eliminado el carrito con id ${id}`;
    }
}

module.exports = ContainerMongo;
