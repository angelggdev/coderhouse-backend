const CartContainer = require('../models/CartContainer');

const cart = new CartContainer();

module.exports = function(cartRouter) {
    cartRouter.post('/', async (req, res) => {
        const operation = await cart.createCart();
        res.send(`se ha creado un carrito con el id ${operation}`);
    });

    cartRouter.delete('/:id', async (req, res) => {
        res.send(await cart.deleteCart(parseInt(req.params.id)));
    });

    cartRouter.get('/:id/productos', async (req, res) => {
        const operation = await cart.getProducts(parseInt(req.params.id));
        operation
            ? res.send(operation)
            : res.send(`no se encontró un carrito con el id ${req.params.id}`);
    });

    cartRouter.post('/:id/productos', async (req, res) => {
        res.send(
            await cart.addProduct(
                parseInt(req.params.id),
                parseInt(req.body.productId),
                parseInt(req.body.quantity)
            )
        );
    });

    cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
        res.send(
            await cart.deleteProduct(
                parseInt(req.params.id),
                parseInt(req.params.id_prod)
            )
        );
    });
}