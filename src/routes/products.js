const ProductFsDao = require('../daos/products/ProductFsDao');
const ProductsFirebaseDao = require('../daos/products/ProductsFirebaseDao');
const ProductMongoDao = require('../daos/products/ProductMongoDao');
const config = require('../utils/config');

let productContainer;

switch (config.database) {
    case 'fs':
        productContainer = new ProductFsDao();
        break;
    case 'firebase':
        productContainer = new ProductsFirebaseDao();
        break;

    case 'mongo':
        productContainer = new ProductMongoDao();
        break;

    default:
        break;
}


const isAdmin = true;

module.exports = function(router){
    router.get('/', async (req, res) => {
        res.send(await productContainer.getAll());
    });

    router.get('/:id', async (req, res) => {
        const item = await productContainer.getById(req.params.id);
        item.error ? res.send({ error: 'producto no encontrado' }) : res.send(item);
    });

    router.post('/', async (req, res) => {
        if (isAdmin) {
            res.send(
                await productContainer.saveProduct({
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
                await productContainer.updateProduct({
                    id: req.params.id,
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
            const operation = await productContainer.deleteById(req.params.id);
            operation.error? res.send(`No se ha encontrado un producto con el id ${id}`) : res.send(operation);
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/:id' método 'delete' no autorizado",
            });
        }
    });
}