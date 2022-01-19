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

module.exports = function (router) {
    router.get('/', async (req, res) => {
        const operation = await productContainer.getAll();
        res.send(operation);
    });

    router.get('/:id', async (req, res) => {
        const item = await productContainer.getById(req.params.id);
        if (item) {
            res.send(item);
        } else {
            res.send(
                `no se ha encontrado un producto con id ${req.params.id}`
            );
        }
    });

    router.post('/', async (req, res) => {
        if (isAdmin) {
            const operation = await productContainer.saveProduct({
                title: req.body.title,
                price: parseInt(req.body.price),
                thumbnail: req.body.thumbnail,
                description: req.body.description,
                stock: parseInt(req.body.stock),
                timestamp: Date.now(),
            });
            res.send(operation);
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/' método 'post' no autorizado",
            });
        }
    });

    router.put('/:id', async (req, res) => {
        if (isAdmin) {
            const operation = await productContainer.updateProduct({
                id: req.params.id,
                title: req.body.title? req.body.title:null,
                price: req.body.price? req.body.price:null,
                thumbnail: req.body.thumbnail? req.body.thumbnail:null,
                description: req.body.description? req.body.description:null,
                stock: req.body.stock? req.body.stock:null,
            });
            res.send(operation);
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
            res.send(operation);
        } else {
            res.send({
                error: -1,
                descripcion: "ruta '/:id' método 'delete' no autorizado",
            });
        }
    });
};
