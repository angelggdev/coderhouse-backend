const express = require('express');
const { Router } = express;
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor([
    {
        title: 'remera',
        price: 1400,
        thumbnail:
            'https://www.remerasya.com/pub/media/catalog/product/cache/e4d64343b1bc593f1c5348fe05efa4a6/r/e/remera_negra_lisa_1.jpg',
        id: 1,
    },
    {
        title: 'pantalon',
        price: 6000,
        thumbnail:
            'https://d3ugyf2ht6aenh.cloudfront.net/stores/144/702/products/buzo_franco_grismelange-1-copia1-8de0fc1cd56341bcbe15797156441482-480-0.jpg',
        id: 2,
    },
    {
        title: 'buzo',
        price: 4000,
        thumbnail:
            'https://www.guantexindustrial.com.ar/807-large_default/pantalon-jeans-talle-56.jpg',
        id: 3,
    },
]);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const router = Router();

const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

router.get('/', (request, response) => {
    const list = contenedor.getAll();
    const showList = list.length > 0 ? true: false;
    response.render('productos.ejs', {list: list, showList: showList});
});

router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const item = contenedor.getById(id);
    item
        ? response.send(item)
        : response.send({ error: 'producto no encontrado' });
});

router.post('/', (request, response) => {
    const operation = contenedor.save({
        title: request.body.title,
        price: request.body.price,
        thumbnail: request.body.thumbnail,
    });
    response.redirect('/');
});

router.put('/:id', (request, response) => {
    contenedor.save({
        id: parseInt(request.params.id),
        title: request.body.title,
        price: request.body.price,
        thumbnail: request.body.thumbnail,
    });
    response.send(`se actualizó un producto con el id ${request.params.id}`);
});

router.delete('/:id', (request, response) => {
    contenedor.deleteById(parseInt(request.params.id));
    response.send(`producto con id ${request.params.id} eliminado`);
});

app.use('/api/productos', router);
app.use(express.static('public'));
