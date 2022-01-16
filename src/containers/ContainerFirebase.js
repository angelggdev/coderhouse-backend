const admin = require("firebase-admin");
const serviceAccount = require("../utils/ecommerce-99ede-firebase-adminsdk-h6p0r-8751704e18.json")

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
        let _productId;
        try{
            const subCol = await cart.collection('products').get();
            _productId = subCol.docs.filter((x) => x.id === productId)[0];
        } catch(err) {
            console.log(err)
        }
        if (cart !== undefined) {
            if (_productId !== undefined) {
                const subCol = cart.collection('products');
                let _quantity;
                try{
                    let product;
                    await subCol.doc(productId).get().then((res) => product = res.data());
                    _quantity = product.quantity;

                } catch(e) {
                    console.log(e);
                }
                const itemUpdated = subCol.doc(productId).update({
                    quantity: _quantity + quantity
                })
                return `Se ha actualizado el producto con el id ${id}`;
            } else { 

                //en vez de agregar el producto completo solo agregar id: id y desp pedir el producto 
                const products = await this.db.collection('products').get();
                let product = products.docs.filter((x) => x.id === productId)[0];
                product = product.data()
                const subCol = cart.collection('products');
                subCol.add({
                    ...product,
                    quantity: quantity
                })
                return `Se ha agregado un producto con el id ${id}`; 
            }
        } else {
            return { error: `No se encontró el carrito con id ${id}` };
        } 
    }

    async deleteCartProduct(id, productId) {
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