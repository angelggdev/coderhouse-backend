const CartFsDao = require('../daos/carts/CartFsDao');

const cart = new CartFsDao();

module.exports = function(cartRouter) {
    cartRouter.post('/', async (req, res) => {
        const operation = await cart.createCart();
        res.send(`se ha creado un carrito con el id ${operation}`);
    });

    cartRouter.delete('/:id', async (req, res) => {
        const operation = await cart.deleteById(parseInt(req.params.id))
        operation.error? res.send(`no se encontró un carrito con el id ${req.params.id}`):res.send(operation);
    });

    cartRouter.get('/:id/productos', async (req, res) => {
        const operation = await cart.getById(parseInt(req.params.id));
        operation.error
            ? res.send(`no se encontró un carrito con el id ${req.params.id}`)
            : res.send(operation.products);
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