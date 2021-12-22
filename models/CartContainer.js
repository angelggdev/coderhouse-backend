const ProductContainer = require('./ProductContainer');
const FileSystem = require('./FileSystem');

const productContainer = new ProductContainer();

class CartContainer extends FileSystem {
    constructor() {
        super('./txt/carrito.txt');
    }

    async createCart() {
        let carts = await this.readFile();
        const id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        let newCart = {
            id: id,
            timestamp: Date.now(),
            products: [],
        };
        carts.push(newCart);
        await this.writeFile(carts);
        return id;
    }

    async deleteCart(id) {
        const carts = await this.readFile();
        const filteredCarts = carts.filter((x) => x.id !== id);
        if (carts.length === filteredCarts.length) {
            return `no se encontró el carrito con id ${id}`;
        } else {
            await this.writeFile(filteredCarts);
            return `se ha eliminado el carrito con el id ${id}`;
        }
    }

    async getProducts(id) {
        let cart = await this.readFile();
        cart = cart.filter((x) => x.id === id)[0];
        if (cart) {
            return cart.products;
        } else {
            return null;
        }
    }

    async addProduct(id, productId, quantity) {
        let carts = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex;
        if (cartIndex !== undefined) {
            carts[cartIndex].products.forEach((x, i) => {
                if (x.id === productId) {
                    productIndex = i;
                }
            });
            if (productIndex !== undefined) {
                carts[cartIndex].products[productIndex].quantity += quantity;
                this.writeFile(carts);
                return `Se ha actualizado el producto con el id ${id}`;
            } else {
                let product;
                try {
                    product = await productContainer.getById(productId);
                } catch (err) {
                    console.log(err);
                }
                if (product) {
                    carts[cartIndex].products.push({
                        ...product,
                        quantity,
                    });
                    this.writeFile(carts);
                    return `Se ha agregado un producto con el id ${id}`;
                } else {
                    return `No se ha encontrado el producto con el id ${id}`;
                }
            }
        } else {
            return `No se encontró el carrito con id ${id}`;
        }
    }

    async deleteProduct(id, productId) {
        let carts = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex;
        if (cartIndex !== undefined) {
            carts[cartIndex].products.forEach((x, i) => {
                if (x.id === productId) {
                    productIndex = i;
                }
            });
            if (productIndex !== undefined) {
                carts[cartIndex].products = carts[cartIndex].products.filter(
                    (x) => x.id !== productId
                );
                this.writeFile(carts);
                return `Se eliminó el producto con id ${productId} del carrito`;
            } else {
                return `El producto con id ${productId} no se encuentra en el carrito`;
            }
        } else {
            return `No se encontró el carrito con id ${id}`;
        }
    }
}

module.exports = CartContainer;
