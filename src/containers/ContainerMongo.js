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
        try {
            const product = await Product.find({ _id: id });
            if (product) {
                await Product.updateOne(
                    { _id: item.id },
                    { $set: { ...item } }
                );
                return `se actualizó el producto con id ${item.id}`;
            } else {
                return {
                    error: `no se encontró un producto con el id ${object.id}`,
                };
            }
        } catch (err) {
            return { error: err };
        }
    }

    async getById(id) {
        try {
            const product = await Product.find({ _id: id });
            if (product) {
                return product;
            } else {
                return null;
            }
        } catch (err) {
            return { error: err };
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
            if (product) {
                await Product.deleteOne({ _id: id });
                return `se ha eliminado el producto con id ${id}`;
            } else {
                return {
                    error: `no se encontró un producto con el id ${object.id}`,
                };
            }
        } catch (err) {
            return { error: err };
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
            const cart = await Cart.find({ _id: id });
            if (cart) {
                return cart.products;
            } else {
                return [];
            }
        } catch (err) {
            return { error: err };
        }
    }

    async addProductToCart(id, productId, quantity) {
        let cart;
        try {
            cart = await Cart.findOne({ _id: id });
        } catch (e) {
            return { error: err };
        }
        let productExists;
        try {
            productExists = await this.getById(productId);
        } catch (err) {
            return { error: err };
        }

        if (cart) {
            if (productExists !== undefined && productExists !== null) {
                let productIndex;
                cart.products.forEach((product, i) => {
                    product.productId === productId && (productIndex = i);
                });
                if (productIndex) {
                    cart.products[productIndex].quantity += quantity;
                    try {
                        await cart.save();
                        return `Se ha actualizado el producto con el id ${productId}`;
                    } catch (err) {
                        return { error: err };
                    }
                } else {
                    const product = {
                        productId: productId,
                        quantity: quantity,
                    };
                    cart.products.push(product);
                    try {
                        await cart.save();
                        `Se ha agregado un producto con el id ${productId}`;
                    } catch (err) {
                        return { error: err };
                    }
                }
            } else {
                return {
                    error: `No se encontró el producto con id ${productId}`,
                };
            }
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async deleteCartProduct(id, productId) {
        let cart;
        try {
            cart = await Cart.findOne({ _id: id });
        } catch (e) {
            return { error: err };
        }
        let productExists;
        try {
            productExists = await this.getById(productId);
        } catch (err) {
            return { error: err };
        }

        if (cart) {
            let productIndex;
            cart.products.forEach((product, i) => {
                product.productId === productId && (productIndex = i);
            });
            if (productIndex) {
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
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async deleteCartById(id) {
        try {
            const cart = await Cart.find({ _id: id });
            if (cart) {
                await Cart.deleteOne({ _id: id });
                return `se ha eliminado el producto con id ${id}`;
            } else {
                return {
                    error: `no se encontró un producto con el id ${object.id}`,
                };
            }
        } catch (err) {
            return { error: err };
        }
    }
}

module.exports = ContainerMongo;
