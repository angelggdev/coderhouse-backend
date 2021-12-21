const fs = require('fs');

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

}

module.exports = CartContainer;