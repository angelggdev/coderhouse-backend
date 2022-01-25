//imports
const express = require('express');
const { Router } = express;
const axios = require('axios');
const fs = require('fs');
const Container = require('./controllers/productsController.js');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

//declaracion de servidores
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//declaracion de otras variables
const PORT = process.env.PORT || 8080;
const contenedor = new Container('products');
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

router.get('/', async (req, res) => {
    const list = await contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('productos.pug', { list: list, showList: showList });
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await contenedor.getById(id);
    item ? res.send(item) : res.send({ error: 'producto no encontrado' });
});

router.post('/', async (req, res) => {
    await contenedor.save({
        name: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    });
    const list = awaitcontenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('productos.pug', { list: list, showList: showList });
});

router.put('/:id', async (req, res) => {
    await contenedor.save({
        id: parseInt(req.params.id),
        name: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    });
    res.send(`se actualizó un producto con el id ${req.params.id}`);
});

router.delete('/:id', async (req, res) => {
    await contenedor.deleteById(parseInt(req.params.id));
    res.send(`producto con id ${req.params.id} eliminado`);
});

app.use('/api/productos', router);

//Web sockets
io.on('connection', async (socket) => {
    //chat socket
    try {
        messages = JSON.parse(
            await fs.promises.readFile('./txt/messages.txt', 'utf-8')
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
                await fs.promises.readFile('./txt/messages.txt', 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }
        savedMessages.unshift(data);
        try {
            fs.promises.writeFile(
                './txt/messages.txt',
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
