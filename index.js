const express = require('express');
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 3000;
const contenedor = new Contenedor('./productos.txt');

const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

app.get('/productos', (request, response) => {
    (async () => {
        try {
            response.send(await contenedor.getAll());
        } catch (err) {
            response.send(err);
        }
    })();
});

app.get('/productoRandom', (request, response) => {
    (async () => {
        try {
            const productos = await contenedor.getAll();
            const ids = productos.map((x) => x.id);
            const id = Math.ceil(Math.random() * ids.length);
            const item = await contenedor.getById(id);
            response.send(item);
        } catch (err) {
            response.send(err);
        }
    })();
});
