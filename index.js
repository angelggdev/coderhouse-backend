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
    res.send(await productContainer.getAll());
});

router.get('/:id', async (req, res) => {
    const item = await productContainer.getById(parseInt(req.params.id));
    item ? res.send(item) : res.send({ error: 'producto no encontrado' });
});

router.post('/', async (req, res) => {
    if (isAdmin) {
        res.send(
            await productContainer.save({
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail,
                description: req.body.description,
                stock: req.body.stock,
                timestamp: Date.now(),
            })
        );
    } else {
        res.send({
            error: -1,
            descripcion: "ruta '/' método 'post' no autorizado",
        });
    }
});

router.put('/:id', async (req, res) => {
    if (isAdmin) {
        res.send(
            await productContainer.save({
                id: parseInt(req.params.id),
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail,
                description: req.body.description,
                stock: req.body.stock,
            })
        );
    } else {
        res.send({
            error: -1,
            descripcion: "ruta '/:id' método 'put' no autorizado",
        });
    }
});

router.delete('/:id', async (req, res) => {
    if (isAdmin) {
        res.send(await productContainer.deleteById(parseInt(req.params.id)));
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

//api configuration
app.use('/api/productos', router);
app.use('/api/carrito', cartRouter);

//route 404
app.get('*', (req, res) => {
    res.send({
        error: -2,
        descripcion: `ruta ${req.path} método ${req.method} no implementada`,
    });
});

//server initialization
const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor', error);
});
