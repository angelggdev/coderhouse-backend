//imports
const express = require('express');
const { Router } = express;

//variables
const app = express();
const PORT = process.env.PORT || 8080;
const router = Router();
const cartRouter = Router();

//api configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//routing

//route api/productos
require('./routes/products')(router);

//route api/carrito
require('./routes/cart')(cartRouter);

//api configuration
app.use('/api/productos', router);
app.use('/api/carrito', cartRouter);

//route 404
app.get('*', (req, res) => {
    res.send({
        error: -2,
        descripcion: `ruta ${req.path} método ${req.method} no implementada`,
    });
});

//server initialization
const server = app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor', error);
});
