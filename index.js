const express = require('express');
const Contenedor = require('./Contenedor.js');

const app = express();
const PORT = process.env.PORT || 3000;
const contenedor = new Contenedor();

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

app.get('/producto/:id', async (request, response) => {
    try {
        const id = parseInt(request.params.id);
        const item = await contenedor.getById(id);
        response.send(item);
    } catch (err) {
        response.send(err);
    }
});
