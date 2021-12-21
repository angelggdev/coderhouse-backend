const fs = require('fs');
const Container = require('./Container');

const container = new Container('./txt/productos.txt');

class CartContainer {

    fileName = './txt/carrito.txt';

    async createCart(){
        let carts = [];
        try {
            carts = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }
        const id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        let newCart = {id: id, products: []};
        carts.push(newCart);
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(carts));
            return id;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteCart(id){
        try {
            const carts = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            ).filter((x) => x.id !== id);
            await fs.promises.writeFile(this.fileName, JSON.stringify(carts));
            console.log(`producto con id ${id} eliminado`);
        } catch (err) {
            console.log(err);
        }
    }

    async getProducts(id){
        try {
            const cart = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            ).filter(x => x.id === id)[0];
            return cart.products;
        } catch (err) {
            console.log(err);
        }
    }

    async addProduct(id, productId, quantity){
        let carts;
        try {
            carts = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            )
        } catch (err) {
            console.log(err);
        }
        let cartIndex;
        carts.forEach((x, i) => {
            if(x.id === id){
                cartIndex = i;
            }
        })
        let productIndex;
        carts[cartIndex].products.forEach((x, i) => {
            if(x.id === productId) {
                productIndex = i;
            }
        });
        if (productIndex !== undefined) {
            carts[cartIndex].products[productIndex].quantity += quantity;
        } else {
            let product;
            try{
                product = await container.getById(productId);
            } catch (err) {
                console.log(err);
            }
            carts[cartIndex].products.push({
                ...product,
                quantity
            });
        }
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(carts));
        } catch (err) {
            console.log(err);
        }  

    }

    async deleteProduct(id, productId){
        let carts;
        try {
            carts = JSON.parse(
                await fs.promises.readFile(this.fileName, 'utf-8')
            )
        } catch (err) {
            console.log(err);
        }
        let cartIndex;
        carts.forEach((x, i) => {
            if(x.id === id){
                cartIndex = i;
            }
        })
        let productIndex;
        carts[cartIndex].products.forEach((x, i) => {
            if(x.id === productId) {
                productIndex = i;
            }
        });
        if (productIndex !== undefined) {
            carts[cartIndex].products = carts[cartIndex].products.filter(x => x.id !== productId);
        } else {
            console.log(`El producto con id ${productId} no se encuentra en el carrito`);
        }
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(carts));
        } catch (err) {
            console.log(err);
        } 

    }

}

module.exports = CartContainer;