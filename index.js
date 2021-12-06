const express = require('express');
const { Router } = express;
const handlebars = require('express-handlebars');
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor([
    {
        title: 'Medias Homero Simpson',
        price: 1400,
        thumbnail:
            'https://http2.mlstatic.com/D_NQ_NP_2X_905550-MLA46376901856_062021-F.webp',
        id: 1,
    },
    {
        title: 'Manual de monstruos - D&D 5ta Ed.',
        price: 6000,
        thumbnail:
            'https://http2.mlstatic.com/D_NQ_NP_2X_645695-MLA31115125736_062019-F.webp',
        id: 2,
    },
    {
        title: 'Varita Harry Potter',
        price: 4000,
        thumbnail:
            'https://http2.mlstatic.com/D_NQ_NP_2X_888824-MLA46982682951_082021-F.webp',
        id: 3,
    },
]);

app.engine(
    "handlebars",
    handlebars.engine()
)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const router = Router();
app.set('view engine', 'handlebars');
app.set('views', './views');

const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

router.get('/', (request, response) => {
    const list = contenedor.getAll();
    const showList = list.length > 0 ? true: false
    response.render("home", {
        list: list, showList: showList
    });
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
