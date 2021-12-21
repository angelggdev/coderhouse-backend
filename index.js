//imports
const express = require('express');
const { Router } = express;
const Contenedor = require('./models/Contenedor.js');
const CartContainer = require('./models/CartContainer');

//variables
const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor('./txt/productos.txt');
const cart = new CartContainer();
const isAdmin = true;
const router = Router();
const cartRouter = Router();

//api configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//server initialization
const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

//routing

//route api/productos
router.get('/', async (request, response) => {
    const products = await contenedor.getAll();
    response.send(products);
});

router.get('/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const item = await contenedor.getById(id);
    item
        ? response.send(item)
        : response.send({ error: 'producto no encontrado' });
});

router.post('/', async (request, response) => {
    if(isAdmin){
        const operation = await contenedor.save({
            title: request.body.title,
            price: request.body.price,
            thumbnail: request.body.thumbnail,
        });
        response.send(operation);
    } else {
        response.send('No tiene permisos para realizar esta acción');
    }
});

router.put('/:id', async (request, response) => {
    if (isAdmin){
        const operation = await contenedor.save({
            id: parseInt(request.params.id),
            title: request.body.title,
            price: request.body.price,
            thumbnail: request.body.thumbnail,
        });
        response.send(operation);
    } else {
        response.send('No tiene permisos para realizar esta acción');
    }
});

router.delete('/:id', async (request, response) => {
    if(isAdmin){
        await contenedor.deleteById(parseInt(request.params.id));
        response.send(`producto con id ${request.params.id} eliminado`);
    } else {
        response.send('No tiene permisos para realizar esta acción');
    }
});

/////////////////////////////////////////

//route api/carrito
cartRouter.post('/', async (request, response) => {
    const operation = await cart.createCart()
    response.send(`se ha creado un carrito con el id ${operation}`);
});

cartRouter.delete('/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    await cart.deleteCart(id)
    .then(res => response.send(`se ha eliminado el carrito con el id ${id}`));
})

cartRouter.get('/:id/productos', async (request, response) => {
    response.send(await cart.getProducts(parseInt(request.params.id)));
})


//api configuration
app.use('/api/productos', router);
app.use('/api/carrito', cartRouter);
app.use(express.static('public'));
