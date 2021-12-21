import ProductContainer from './ProductContainer';
import FileSystem from './FileSystem';
import { Cart } from './Cart';
import { Product } from './Product';

const container = new ProductContainer();

export default class CartContainer extends FileSystem {

    constructor(){
        super('./txt/carrito.txt');
    }

    async createCart(): Promise<number> {
        let carts: any = await this.readFile();
        const id = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
        let newCart: Cart = { 
            id: id,
            timestamp: Date.now(),
            products: [] 
        };
        carts.push(newCart);
        await this.writeFile(carts);
        return id;
    }

    async deleteCart(id: number): Promise<void> {
        let carts:any = await this.readFile();
        carts = carts.filter((x: Cart) => x.id !== id);
        await this.writeFile(carts);
    }

    async getProducts(id: number): Promise<Array<Product>> {
        let cart:any = await this.readFile();
        cart = cart.filter((x: Cart) => x.id === id)[0];
        return cart.products;
    }

    async addProduct(id: number, productId: number, quantity: number): Promise<void> {
        let carts:any = await this.readFile();
        let cartIndex: number | undefined;
        carts.forEach((x: Cart, i: number) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex: number | undefined;
        if (cartIndex !== undefined) {
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
        } else {
            console.log(`No se encontró el carrito con id ${id}`)
        }
    }

    async deleteProduct(id: number, productId: number): Promise<void> {
        let carts:any = await this.readFile();
        let cartIndex: number | undefined;
        carts.forEach((x: Cart, i: number) => {
            if (x.id === id) {
                cartIndex = i;
            }
        });
        let productIndex: number | undefined;
        if (cartIndex !== undefined) {
            carts[cartIndex].products.forEach((x: Product, i: number) => {
                if (x.id === productId) {
                    productIndex = i;
                }
            });
            if (productIndex !== undefined) {
                carts[cartIndex].products = carts[cartIndex].products.filter(
                    (x: Product) => x.id !== productId
                );
                this.writeFile(carts);
            } else {
                console.log(
                    `El producto con id ${productId} no se encuentra en el carrito`
                );
            }
        } else {
            console.log(`No se encontró el carrito con id ${id}`)
        }
    }
}
