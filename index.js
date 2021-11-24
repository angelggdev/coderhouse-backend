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

app.get('/productos', async (request, response) => {
    try {
        response.send(await contenedor.getAll());
    } catch (err) {
        response.send(err);
    }
});

app.get('/productoRandom', async (request, response) => {
    try {
        const productos = await contenedor.getAll();
        const ids = productos.map((x) => x.id);
        const item = await contenedor.getById(
            Math.ceil(Math.random() * ids.length)
        );
        response.send(item);
    } catch (err) {
        response.send(err);
    }
});
