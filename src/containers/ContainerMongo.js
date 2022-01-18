const mongoose = require('mongoose');
const Product = require('./schemas/product');
const {Cart} = require('./schemas/cart');
const url = require('../utils/mongo-config');

class ContainerMongo {
    
    constructor(collection) {
        this.rta = mongoose.connect(url);
    }
    
    /* Product container */

    async saveProduct(item) {
        const product = new Product(item);
        return await product.save();
    }

    async updateProduct(item) {
        const itemUpdated = Product.updateOne({_id: item.id}, {$set: {...item}});
        return itemUpdated;
    }


    async getById(id) {
        const product = await Product.find({_id: id});

        if (product) {
            return product;
        } else {
            return null;
        }

    }

    async getAll() {
        const products = await Product.find();

        if (products.length > 0) {
            return products;
        } else {
            return { error: 'no se han encontrado productos' };
        }
    }

    async getCartProducts(id) {
        //ver
        const cart = await Cart.find({_id: id}, {products: 1});

        if (cart.length > 0) {
            return cart[0]
        } else {
            return { error: 'no se han encontrado productos' };
        }
    }

    //deletes an Item by its Id
    async deleteById(id) {
        try{
            return await Product.deleteOne({_id: id});
        } catch(e) {
            return e;
        }
    }

    async deleteCartById(id) {
        try{
            return await Cart.deleteOne({_id: id});
        } catch(e) {
            return e;
        }
    }

    /* ////////////////// */

    /* Cart Container */

    async createCart() {
        const cart = new Cart({
            timestamp: Date.now(),
        });
        const cartCreated = await cart.save();
        
        return cartCreated._id;
    }


    async addProductToCart(id, productId, quantity) {
        let cart;
        try{
            cart = await Cart.findOne(
                { _id: id}
            )
        } catch(e) {
            console.log(e)
        }
        let productExists;
        try{
            productExists = await this.getById(productId);
        } catch(err) {
            console.log(err)
        }
        
        if (cart) {

            if (productExists !== undefined && productExists !== null) {
                let productIndex;
                cart.products.forEach((product, i) => {
                    product.productId === productId && (productIndex = i); 
                });
                console.log(productIndex)
        
                if(productIndex) {
                    //actualizo producto
        
                    cart.products[productIndex].quantity += quantity;
                    const cartupdate = await cart.save();
                    console.log(cartupdate) 
                } else {
                    //agrego producto
                    
                    const product = { productId: productId, quantity: quantity };
                    cart.products.push(product);
                    const cartAdd = await cart.save();
                    console.log(cartAdd) 
                }
            } else {
                return { error: `No se encontró el producto con id ${productId}` };
            }

        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async deleteCartProduct(id, productId) {
        let cart;
        try{
            cart = await Cart.findOne(
                { _id: id}
            )
        } catch(e) {
            console.log(e)
        }
        let productExists;
        try{
            productExists = await this.getById(productId);
        } catch(err) {
            console.log(err)
        }

        if (cart) {
            let productIndex;
            cart.products.forEach((product, i) => {
                product.productId === productId && (productIndex = i); 
            });
            console.log(productIndex)
            
        
                if(productIndex) {
                    //actualizo producto
        
                    cart.products = cart.products.filter((product) => product.productId !== productId);
                    const cartUpdated = await cart.save();
                    console.log(cartUpdated) 
                } else {
                    return {
                        error: `El producto con id ${productId} no se encuentra en el carrito`,
                    };
                }
            

        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
        
    }

    /* ////////////////// */
}

module.exports = ContainerMongo;