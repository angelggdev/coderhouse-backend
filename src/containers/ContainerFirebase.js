const admin = require('firebase-admin');
const serviceAccount = require('../utils/ecommerce-99ede-firebase-adminsdk-h6p0r-8751704e18.json');
const { FieldValue } = require('@google-cloud/firestore');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

class ContainerFirebase {
    constructor(collection) {
        this.db = admin.firestore();
        this.collection = collection;
        this.query = this.db.collection(this.collection);
    }

    /* Product container */

    async saveProduct(item) {
        const doc = this.query.doc();
        try {
            await doc.create(item);
            return 'se agregó el producto exitosamente';
        } catch (err) {
            return { error: err };
        }
    }

    async updateProduct(item) {
        const docToUpdate = this.query.doc(item.id);
        const docToUpdateExists = (await docToUpdate.get()).exists;
        let _item = Object.fromEntries(Object.entries(item).filter(([_, v]) => v !== null ));
        delete _item.id;
        if (docToUpdateExists) {
            try {
                await docToUpdate.update(_item);
                return `se actualizó el producto con id ${item.id}`;
            } catch (err) {
                return { error: err };
            }
        } else {
            return {
                error: `no se encontró un producto con el id ${item.id}`,
            };
        }
    }

    async getById(id) {
        const doc = this.query.doc(id);
        try {
            const item = (await doc.get()).data();
            if (item) {
                return item;
            } else {
                return null;
            }
        } catch (err) {
            return { error: err };
        }
    }

    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            const docs = querySnapshot.docs;
            if (docs.length > 0) {
                return docs.map((doc) => doc.data());
            } else {
                return [];
            }
        } catch (err) {
            return { error: err };
        }
    }

    //deletes an Item by its Id
    async deleteById(id) {
        const docToDelete = this.query.doc(id);
        const productExists = (await docToDelete.get()).exists;
        if (productExists) {
            try {
                await docToDelete.delete();
                return `se ha eliminado el item con id ${id}`;
            } catch (err) {
                return { error: err };
            }
        } else {
            return {
                error: `no se encontró un item con el id ${id}`,
            };
        }
    }

    /* Cart Container */

    async createCart() {
        const doc = this.query.doc();
        try {
            const cartCreated = await doc.create({
                timestamp: Date.now(),
            });
            return 'se ha creado un carrito exitosamente';
        } catch (err) {
            return { error: err };
        }
    }

    async getCartProducts(id) {
        try {
            const cart = this.query.doc(id);
            let cartExists;
            try{
                cartExists = (await cart.get()).exists;
            } catch(err) {
                return {error: err};
            }
            const products = (await cart.collection('products').get()).docs;
            if (cartExists) {
                return products.map((product) => product.data());
            } else {
                return { error: `No se encontró el carrito con id ${id}` };
            }
        } catch (err) {
            return { error: err };
        }
    }

    async addProductToCart(id, productId, quantity) {
        const cart = this.query.doc(id);
        let cartExists;
        let productInCart;
        let productExists;
        try{
            cartExists = (await cart.get()).exists;
        } catch(err) {
            return {error: err};
        }
        try {
            const subCol = await cart.collection('products').get();
            productInCart = subCol.docs.filter(
                (x) => x.data().productId === productId
            )[0];
        } catch (err) {
            return { error: err };
        }
        try {
            const products = await this.db.collection('products').get();
            productExists = products.docs.filter((x) => x.id === productId)[0]
                ? true
                : false;
        } catch (err) {
            return { error: err };
        }
        if (cartExists) {
            if (productExists) {
                if (productInCart !== undefined) {
                    const subCol = cart.collection('products');
                    try {
                        await subCol
                            .doc(productInCart.id)
                            .update(
                                { quantity: FieldValue.increment(quantity) },
                                { merge: true }
                            );
                        return `Se ha actualizado el producto con el id ${productId}`;
                    } catch (err) {
                        return { error: err };
                    }
                } else {
                    const subCol = cart.collection('products');
                    try {
                        await subCol.add({
                            productId: productId,
                            quantity: quantity,
                        });
                        return `Se ha agregado un producto con el id ${productId}`;
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
        const cart = this.query.doc(id);
        let cartExists;
        let productInCart;
        try{
            cartExists = (await cart.get()).exists;
        } catch(err) {
            return {error: err};
        }
        try {
            const subCol = await cart.collection('products').get();
            productInCart = subCol.docs.filter(
                (x) => x.data().productId === productId
            )[0];
        } catch (err) {
            return { error: err };
        }
        if (cartExists) {
            if (productInCart) {
                try {
                    await cart
                        .collection('products')
                        .doc(productInCart.id)
                        .delete();
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
        return await this.deleteById(id);
    }
}

module.exports = ContainerFirebase;
