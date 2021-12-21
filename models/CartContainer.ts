import ProductContainer from './ProductContainer';
import FileSystem from './FileSystem';

const container = new ProductContainer();

export default class CartContainer extends FileSystem {

    constructor(){
        super('./txt/carrito.txt');
    }

    async createCart() {
        let carts:any = await this.readFile();
        const id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        let newCart = { 
            id: id,
            timestamp: Date.now(),
            products: [] 
        };
        carts.push(newCart);
        await this.writeFile(carts);
        return id;
    }

    async deleteCart(id) {
        let carts:any = await this.readFile();
        carts = carts.filter((x) => x.id !== id);
        await this.writeFile(carts);
    }

    async getProducts(id) {
        let cart:any = await this.readFile();
        cart = cart.filter((x) => x.id === id)[0];
        return cart.products;
    }

    async addProduct(id, productId, quantity) {
        let carts:any = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex;
        carts[cartIndex].products.forEach((x, i) => {
            if (x.id === productId) {
                productIndex = i;
            }
        });
        if (productIndex !== undefined) {
            carts[cartIndex].products[productIndex].quantity += quantity;
        } else {
            let product;
            try {
                product = await container.getById(productId);
            } catch (err) {
                console.log(err);
            }
            carts[cartIndex].products.push({
                ...product,
                quantity,
            });
        }
        this.writeFile(carts);
    }

    async deleteProduct(id, productId) {
        let carts:any = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex;
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
        } else {
            console.log(
                `El producto con id ${productId} no se encuentra en el carrito`
            );
        }
    }
}
