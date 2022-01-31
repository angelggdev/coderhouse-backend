//imports
const express = require('express');
const { Router } = express;
const axios = require('axios');
const fs = require('fs');
const ProductDao = require('./dao/ProductDao');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const normalizr = require('normalizr');
const messagesSchema = require('./schemas/messages');

//declaracion de servidores
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//declaracion de otras variables
const PORT = process.env.PORT || 8080;
const productContainer = new ProductDao();
let messages = [];
const router = Router();

//configuración del motor de plantillas
app.set('views', 'src/views');
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
    const list = await productContainer.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('index.pug', { list: list, showList: showList });
});

require('./routes/products-test')(app);

require('./routes/products')(router);

//api configuration
app.use('/api/productos', router);

//Web sockets
io.on('connection', async (socket) => {
    //chat socket
    try {
        messages = JSON.parse(
            await fs.promises.readFile('src/txt/messages.txt', 'utf-8')
        );
    } catch (err) {
        console.log(err);
    }

    const normalizedMessages = normalizr.normalize(messages, messagesSchema);
    socket.emit('messages', normalizedMessages);

    socket.on('new-message', async (data) => {
        data.time = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
        data.id = data.time;
        //messages.messages.push(data);
        let savedMessages;

        try {
            savedMessages = JSON.parse(
                await fs.promises.readFile('src/txt/messages.txt', 'utf-8')
            );
        } catch (err) {
            console.log(err);
        }

        savedMessages.messages.push(data);

        try {
            fs.promises.writeFile(
                'src/txt/messages.txt',
                JSON.stringify(savedMessages)
            );
        } catch (err) {
            console.log(err);
        }
        const normalizedData = normalizr.normalize(
            savedMessages,
            messagesSchema
        );
        io.sockets.emit('messages', normalizedData);
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
        await productContainer.saveProduct({
            name: data.title,
            price: data.price,
            thumbnail: data.thumbnail,
        });
        await getProducts();
        io.sockets.emit('products', products);
    });
});
