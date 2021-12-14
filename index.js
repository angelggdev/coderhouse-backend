//imports
const express = require('express');
const { Router } = express;
const axios = require('axios');
const fs = require('fs');
const Contenedor = require('./Contenedor.js');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

//declaracion de servidores
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//declaracion de otras variables
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
app.get('/', (req, res) => {
    const list = contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('index.pug', { list: list, showList: showList });
});

router.get('/', (request, response) => {
    const list = contenedor.getAll();
    const showList = list.length > 0 ? true: false;
    response.render('productos.pug', { list: list, showList: showList });
}); 

/* router.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const item = contenedor.getById(id);
    item
        ? response.send(item)
        : response.send({ error: 'producto no encontrado' });
}); */

router.post('/', (request, response) => {
    contenedor.save({
        title: request.body.title,
        price: request.body.price,
        thumbnail: request.body.thumbnail,
    });
    const list = contenedor.getAll();
    const showList = list.length > 0 ? true: false;
    response.render('productos.pug', { list: list, showList: showList });
}); 

/* router.put('/:id', (request, response) => {
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
}); */

app.use('/api/productos', router);
//app.use(express.static('public'));

//Web sockets
io.on('connection', async (socket) => {
    try {
        messages = JSON.parse(
            await fs.promises.readFile('messages.txt', 'utf-8')
        );
    } catch (err) {
        console.log(err);
    }

    socket.emit('messages', messages); 

    let products; 

    async function getProducts(){
    
        const url = `http://localhost:${PORT}/api/productos`
        await axios.get(url)
        .then(res => products = res.data)
        .catch(err => console.log(err));

    }

    await getProducts();

    socket.emit('products', products); 

    socket.on('new-product', async data => {
        contenedor.save({
            title: data.title,
            price: data.price,
            thumbnail: data.thumbnail,
        });
        await getProducts();
        io.sockets.emit('products', products); 

    }) 

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
    

});

