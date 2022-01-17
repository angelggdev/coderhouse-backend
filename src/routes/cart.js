const CartFsDao = require('../daos/carts/CartFsDao');
const CartFirebaseDao = require('../daos/carts/CartFirebaseDao');
const CartMongoDao = require('../daos/carts/CartMongoDao');
const config = require('../utils/config');

let cart;

switch (config.database) {
    case 'fs':
        cart = new CartFsDao();
        break;
    case 'firebase':
        cart = new CartFirebaseDao();
        break;

    case 'mongo':
        cart = new CartMongoDao();
        break;

    default:
        break;
}

module.exports = function(cartRouter) {
    cartRouter.post('/', async (req, res) => {
        const operation = await cart.createCart();
        res.send(`se ha creado un carrito con el id ${operation}`);
    });

    cartRouter.delete('/:id', async (req, res) => {
        const operation = await cart.deleteById(parseInt(req.params.id))
        operation.error? res.send(`no se encontró un carrito con el id ${req.params.id}`):res.send(operation);
    });

    cartRouter.get('/:id/products', async (req, res) => {
        const operation = await cart.getCartProducts(parseInt(req.params.id));
        operation.error
            ? res.send(`no se encontró un carrito con el id ${req.params.id}`)
            : res.send(operation.products);
    });

    cartRouter.post('/:id/products', async (req, res) => {
        res.send(
            await cart.addProductToCart(
                req.params.id,
                req.body.productId,
                parseInt(req.body.quantity)
            )
        );
    });

    cartRouter.delete('/:id/products/:id_prod', async (req, res) => {
        res.send(
            await cart.deleteCartProduct(
                req.params.id,
                req.params.id_prod
            )
        );
    });
}