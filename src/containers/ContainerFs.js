const fs = require('fs');

class ContainerFs {
    constructor(fileRoute) {
        this.fileRoute = fileRoute;
    }

    //reads the txt file and returns its content
    async readFile() {
        try {
            const object = JSON.parse(
                await fs.promises.readFile(this.fileRoute, 'utf-8')
            );
            return object;
        } catch (err) {
            return [];
        }
    }

    //overwrites a txt file
    async writeFile(data) {
        try {
            await fs.promises.writeFile(this.fileRoute, JSON.stringify(data));
        } catch (err) {
            console.log(err);
        }
    }

    /* Product container */

    async saveProduct(object) {
        let objects = await this.readFile();
        const id =
            objects.length === 0 ? 1 : objects[objects.length - 1].id + 1;
        objects.push({ ...object, id });
        await this.writeFile(objects);
        return `se agregó un producto con el id ${id}`;
    }

    async updateProduct(object) {
        let objects = await this.readFile();
        object.id = parseInt(object.id);
        let objectIndex;
        objects.forEach((x, i) => x.id === object.id && (objectIndex = i));

        //deletes the non existing values from the object
        let _object = Object.fromEntries(Object.entries(object).filter(([_, v]) => v !== (null || undefined) && !isNaN(v)));
        if (objectIndex !== undefined) {
            Object.assign(objects[objectIndex], _object);
            await this.writeFile(objects);
            return `se actualizó el producto con el id ${object.id}`;
        } else {
            return {
                error: `no se encontró un producto con el id ${object.id}`,
            };
        }
    }

    async getById(number) {
        const objects = await this.readFile();
        if (objects.length > 0) {
            const object = objects.filter((x) => x.id === parseInt(number))[0];
            return object;
        } else {
            return null;
        }
    }

    async getAll() {
        const objects = await this.readFile();
        if (objects.length > 0) {
            return objects;
        } else {
            return [];
        }
    }

    //deletes an Item by its Id
    async deleteById(id) {
        const objects = await this.readFile();
        const filteredObjects = objects.filter((x) => x.id !== parseInt(id));
        if (objects.length === filteredObjects.length) {
            return {
                error: `no se encontró un item con el id ${id}`,
            };
        } else {
            await this.writeFile(filteredObjects);
            return `se ha eliminado el item con id ${id}`;
        }
    }

    /* Cart Container */

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
        return `se ha creado un carrito con el id ${id}`;
    }

    async getCartProducts(id) {
        let cart = await this.readFile();
        cart = cart.filter((x) => x.id === parseInt(id))[0];
        if (cart) {
            return cart.products;
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async addProductToCart(id, productId, quantity) {
        let carts = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === parseInt(id)) {
                cartIndex = i;
            }
        });
        let productIndex;
        if (cartIndex !== undefined) {
            carts[cartIndex].products.forEach((x, i) => {
                if (x.id === parseInt(productId)) {
                    productIndex = i;
                }
            });
            if (productIndex !== undefined) {
                carts[cartIndex].products[productIndex].quantity += quantity;
                carts[cartIndex].products[productIndex].id = parseInt(carts[cartIndex].products[productIndex].id);
                this.writeFile(carts);
                return `Se ha actualizado el producto con el id ${productId}`;
            } else {
                let product;
                try {
                    const products = JSON.parse(
                        await fs.promises.readFile(this.fileRoute, 'utf-8')
                    );
                    product = products.filter((x) => x.id === parseInt(productId))[0];
                } catch (err) {
                    return {error: err}
                }
                if (product) {
                    carts[cartIndex].products.push({
                        id: parseInt(productId),
                        quantity,
                    });
                    this.writeFile(carts);
                    return `Se ha agregado un producto con el id ${productId}`;
                } else {
                    return {
                        error: `No se ha encontrado el producto con el id ${productId}`,
                    };
                }
            }
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        }
    }

    async deleteCartProduct(id, productId) {
        let carts = await this.readFile();
        let cartIndex;
        carts.forEach((x, i) => {
            if (x.id === parseInt(id)) {
                cartIndex = i;
            }
        });
        let productIndex;
        if (cartIndex !== undefined) {
            carts[cartIndex].products.forEach((x, i) => {
                if (x.id === parseInt(productId)) {
                    productIndex = i;
                }
            });
            if (productIndex !== undefined) {
                carts[cartIndex].products = carts[cartIndex].products.filter(
                    (x) => x.id !== parseInt(productId)
                );
                this.writeFile(carts);
                return `Se eliminó el producto con id ${productId} del carrito`;
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
        return await this.deleteById(parseInt(id));
    }
}

module.exports = ContainerFs;
