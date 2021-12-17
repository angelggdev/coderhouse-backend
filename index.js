const express = require('express');
const { Router } = express;
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor('productos.txt');
const isAdmin = true;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const router = Router();

const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

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
        response.send(`se agregó un producto con el id ${operation}`);
    } else {
        response.send('No tiene permisos para realizar esta acción');
    }
});

router.put('/:id', async (request, response) => {
    if (isAdmin){
        await contenedor.save({
            id: parseInt(request.params.id),
            title: request.body.title,
            price: request.body.price,
            thumbnail: request.body.thumbnail,
        });
        response.send(`se actualizó un producto con el id ${request.params.id}`);
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

app.use('/api/productos', router);
app.use(express.static('public'));
