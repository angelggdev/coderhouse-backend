//imports
const express = require('express');
const { Router } = express;
const axios = require('axios');
const fs = require('fs');
const Contenedor = require('./models/Contenedor.js');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

//declaracion de servidores
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//declaracion de otras variables
const PORT = process.env.PORT || 8080;
const contenedor = new Contenedor('products');
let messages = [];
const router = Router();

//configuración del motor de plantillas
app.set('views', './views');
app.set('view engine', 'pug');

//configuración del servidor
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = httpServer.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor' + error);
});

//routing
app.get('/', async (req, res) => {
    const list = await contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('index.pug', { list: list, showList: showList });
});

router.get('/', async (request, response) => {
    const list = await contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    response.render('productos.pug', { list: list, showList: showList });
});

router.get('/:id', async (request, response) => {
    const id = parseInt(request.params.id);
    const item = await contenedor.getById(id);
    item
        ? response.send(item)
        : response.send({ error: 'producto no encontrado' });
});

router.post('/', async (request, response) => {
    await contenedor.save({
        name: request.body.title,
        price: request.body.price,
        thumbnail: request.body.thumbnail,
    });
    const list = awaitcontenedor.getAll();
    const showList = list.length > 0 ? true : false;
    response.render('productos.pug', { list: list, showList: showList });
});

router.put('/:id', async (request, response) => {
    await contenedor.save({
        id: parseInt(request.params.id),
        name: request.body.title,
        price: request.body.price,
        thumbnail: request.body.thumbnail,
    });
    response.send(`se actualizó un producto con el id ${request.params.id}`);
});

router.delete('/:id', async (request, response) => {
    await contenedor.deleteById(parseInt(request.params.id));
    response.send(`producto con id ${request.params.id} eliminado`);
});

app.use('/api/productos', router);

//Web sockets
io.on('connection', async (socket) => {
    //chat socket
    try {
        messages = JSON.parse(
            await fs.promises.readFile('messages.txt', 'utf-8')
        );
    } catch (err) {
        console.log(err);
    }

    socket.emit('messages', messages);

    socket.on('new-message', async (data) => {
        data.time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        messages.push(data);
        let savedMessages = [];

        try {
            savedMessages = JSON.parse(
                await fs.promises.readFile('messages.txt', 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }
        savedMessages.unshift(data);
        try {
            fs.promises.writeFile(
                'messages.txt',
                JSON.stringify(savedMessages)
            );
        } catch (err) {
            console.log(err);
        }
        io.sockets.emit('messages', [data]);
    });

    //products socket

    let products;

    async function getProducts() {
        const url = `http://localhost:${PORT}/api/productos`;
        await axios
            .get(url)
            .then((res) => (products = res.data))
            .catch((err) => console.log(err));
    }

    await getProducts();

    socket.emit('products', products);

    socket.on('new-product', async (data) => {
        await contenedor.save({
            name: data.title,
            price: data.price,
            thumbnail: data.thumbnail,
        });
        await getProducts();
        io.sockets.emit('products', products);
    });
});
