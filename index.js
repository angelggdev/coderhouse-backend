const express = require('express');
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 3000;
const contenedor = new Contenedor('./productos.txt');

//hace falta el stringify?

const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor');
});

app.get('/productos', (request, response) => {
    (async () => {
        try {
            response.send(JSON.stringify(await contenedor.getAll()));
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
            //arreglar que el random te da 0 a veces
            const id = Math.floor(Math.random() * ids.length);
            console.log(id);
            const item = await contenedor.getById(id);
            response.send(JSON.stringify(item));
        } catch (err) {
            response.send(err);
        }
    })();
});
