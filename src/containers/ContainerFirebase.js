const admin = require("firebase-admin");
const serviceAccount = require("../utils/ecommerce-99ede-firebase-adminsdk-h6p0r-8751704e18.json");
const { FieldValue } = require("@google-cloud/firestore");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

class ContainerFirebase {

    constructor(collection) {
        this.db = admin.firestore();
        this.collection = collection;
        this.query = this.db.collection(this.collection);
    }
    
    /* Product container */

    async saveProduct(item) {
        const doc = this.query.doc();
        return await doc.create(item);
    }

    async updateProduct(item) {
        const docUpdateById = this.query.doc(item.id);
        let itemUpdated = await docUpdateById.update(item);
        return itemUpdated;
    }


    async getById(id) {
        const doc = this.query.doc(id);
        const item = await doc.get();

        const responseId = item.data();

        if (responseId) {
            return responseId;
        } else {
            return null;
        }
    }

    async getAll() {
        const querySnapshot = await this.query.get();
        const docs = querySnapshot.docs;

        if (docs.length > 0) {
            return docs.map(doc => doc.data());
        } else {
            return { error: 'no se han encontrado productos' };
        }
    }

    async getCartProducts() {
        const querySnapshot = await this.query.get();
        const docs = querySnapshot.docs;

        if (docs.length > 0) {
            return docs.map(doc => doc.data());
        } else {
            return { error: 'no se han encontrado productos' };
        }
    }

    //deletes an Item by its Id
    async deleteById(id) {
        const docForDelete = this.query.doc(idDelete);
        try{
            return await docForDelete.delete();
        } catch(e) {
            return e;
        }
    }

    /* ////////////////// */

    /* Cart Container */

    async createCart() {
        const doc = this.query.doc();
        const cartCreated = await doc.create({
            timestamp: Date.now()
        })
        
        return cartCreated;
    }


    async addProductToCart(id, productId, quantity) {
        const cart = this.query.doc(id);
        let productInCart;
        let productExists;
        try{
            const subCol = await cart.collection('products').get();
            productInCart = subCol.docs.filter((x) => x.data().productId === productId)[0];
        } catch(err) {
            console.log(err)
        }
        try{
            const products = await this.db.collection('products').get();
            productExists = products.docs.filter((x) => x.id === productId)[0]? true: false;
            console.log(productExists)
        } catch(err) {
            console.log(err)
        }
        if (cart !== undefined) {
            if (productExists) {
                if (productInCart !== undefined) {
                    const subCol = cart.collection('products');
                    const itemUpdated = subCol.doc(productInCart.id).update({quantity: FieldValue.increment(quantity)}, {merge: true});
                    return `Se ha actualizado el producto con el id ${id}`;
                } else { 
                    const subCol = cart.collection('products');
                    subCol.add({
                        productId: productId,
                        quantity: quantity
                    })
                    return `Se ha agregado un producto con el id ${id}`; 
                }
            } else {
                return { error: `No se encontró el producto con id ${productId}` };
            }
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        } 
    }

    async deleteCartProduct(id, productId) {
        console.log(id)
        const cart = this.query.doc(id);
        let productInCart;
        try{
            const subCol = await cart.collection('products').get();
            productInCart = subCol.docs.filter((x) => x.data().productId === productId)[0];
        } catch(err) {
            console.log(err)
        }
        if (cart) {
            if (productInCart) {
                const itemToDelete = cart.collection('products').doc(productInCart.id).delete();
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

    /* ////////////////// */
}

module.exports = ContainerFirebase;