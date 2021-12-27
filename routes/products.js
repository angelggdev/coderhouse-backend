const ProductContainer = require('../models/ProductContainer.js');

const productContainer = new ProductContainer('../txt/productos.txt');
const isAdmin = true;

module.exports = function(router){
    router.get('/', async (req, res) => {
        res.send(await productContainer.getAll());
    });

    router.get('/:id', async (req, res) => {
        const item = await productContainer.getById(parseInt(req.params.id));
        item ? res.send(item) : res.send({ error: 'producto no encontrado' });
    });

    router.post('/', async (req, res) => {
        if (isAdmin) {
            res.send(
                await productContainer.save({
                    title: req.body.title,
                    price: req.body.price,
                    thumbnail: req.body.thumbnail,
                    description: req.body.description,
                    stock: req.body.stock,
                    timestamp: Date.now(),
                })
            );
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/' método 'post' no autorizado",
            });
        }
    });

    router.put('/:id', async (req, res) => {
        if (isAdmin) {
            res.send(
                await productContainer.save({
                    id: parseInt(req.params.id),
                    title: req.body.title,
                    price: req.body.price,
                    thumbnail: req.body.thumbnail,
                    description: req.body.description,
                    stock: req.body.stock,
                })
            );
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/:id' método 'put' no autorizado",
            });
        }
    });

    router.delete('/:id', async (req, res) => {
        if (isAdmin) {
            res.send(await productContainer.deleteById(parseInt(req.params.id)));
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/:id' método 'delete' no autorizado",
            });
        }
    });
}