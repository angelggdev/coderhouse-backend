//imports
const express = require('express');
const { Router } = express;
const ProductContainer = require('./models/ProductContainer.js');
const CartContainer = require('./models/CartContainer');

//variables
const app = express();
const PORT = process.env.PORT || 8080;
const productContainer = new ProductContainer('./txt/productos.txt');
const cart = new CartContainer();
const isAdmin = true;
const router = Router();
const cartRouter = Router();

//api configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//routing

//route api/productos
router.get('/', async (req, res) => {
    const products = await productContainer.getAll();
    res.send(products);
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await productContainer.getById(id);
    item ? res.send(item) : res.send({ error: 'producto no encontrado' });
});

router.post('/', async (req, res) => {
    if (isAdmin) {
        const operation = await productContainer.save({
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            stock: req.body.stock,
            timestamp: Date.now(),
        });
        res.send(operation);
    } else {
        res.send({
            error: -1,
            descripcion: "ruta '/' método 'post' no autorizado",
        });
    }
});

router.put('/:id', async (req, res) => {
    if (isAdmin) {
        const operation = await productContainer.save({
            id: parseInt(req.params.id),
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            stock: req.body.stock
        });
        res.send(operation);
    } else {
        res.send({
            error: -1,
            descripcion: "ruta '/:id' método 'put' no autorizado",
        });
    }
});

router.delete('/:id', async (req, res) => {
    if (isAdmin) {
        await productContainer.deleteById(parseInt(req.params.id));
        res.send(`producto con id ${req.params.id} eliminado`);
    } else {
        res.send({
            error: -1,
            descripcion: "ruta '/:id' método 'delete' no autorizado",
        });
    }
});

//route api/carrito
cartRouter.post('/', async (req, res) => {
    const operation = await cart.createCart();
    res.send(`se ha creado un carrito con el id ${operation}`);
});

cartRouter.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await cart
        .deleteCart(id)
        .then(() => res.send(`se ha eliminado el carrito con el id ${id}`));
});

cartRouter.get('/:id/productos', async (req, res) => {
    res.send(await cart.getProducts(parseInt(req.params.id)));
});

cartRouter.post('/:id/productos', async (req, res) => {
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.body.productId);
    const quantity = req.body.quantity;
    await cart.addProduct(cartId, productId, quantity);
    res.send(
        `se agregó el producto con id ${productId} al carrito con id ${cartId}`
    );
});

cartRouter.delete('/:id/productos/:id_prod', async (req, res) => {
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.params.id_prod);
    await cart.deleteProduct(cartId, productId);
    res.send(
        `se eliminó el producto con id ${productId} del carrito con id ${cartId}`
    );
});

//api configuration
app.use('/api/productos', router);
app.use('/api/carrito', cartRouter);

//route 404
app.get('*', (req, res) => {
    const requestedRoute = req.path;
    const requestedMethod = req.method;
    res.send({
        error: -2,
        descripcion: `ruta ${requestedRoute} método ${requestedMethod} no implementada`,
    });
});

//server initialization
const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor', error);
});
