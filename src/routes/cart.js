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

module.exports = function (cartRouter) {
    cartRouter.post('/', async (req, res) => {
        const operation = await cart.createCart();
        res.send(operation);
    });

    cartRouter.delete('/:id', async (req, res) => {
        const operation = await cart.deleteCartById(req.params.id);
        res.send(operation);
    });

    cartRouter.get('/:id/productos', async (req, res) => {
        const operation = await cart.getCartProducts(req.params.id);
        res.send(operation);
    });

    cartRouter.post('/:id/productos', async (req, res) => {
        const operation = await cart.addProductToCart(
            req.params.id,
            req.body.productId,
            parseInt(req.body.quantity)
        );
        res.send(operation);
    });

    cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
        const operation = await cart.deleteCartProduct(
            req.params.id,
            req.params.id_prod
        );
        res.send(operation);
    });
};
