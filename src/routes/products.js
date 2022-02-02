const ProductDao = require('../dao/ProductDao');
const productContainer = new ProductDao();

function auth(req, res, next) {
    if(req.session.user){
        return next()
    }
    return res.redirect('/');
}

module.exports = function (router) {
    router.get('/', async (req, res) => {
        const list = await productContainer.getAll();
        const showList = list.length > 0 ? true : false;
        res.render('productos.pug', { list: list, showList: showList });
    });
    
    router.get('/:id', auth,async (req, res) => {
        const id = req.params.id;
        const item = await productContainer.getById(id);
        item ? res.send(item) : res.send({ error: 'producto no encontrado' });
    });
    
    router.post('/', auth, async (req, res) => {
        await productContainer.saveProduct({
            name: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        });
        const list = awaitproductContainer.getAll();
        const showList = list.length > 0 ? true : false;
        res.render('productos.pug', { list: list, showList: showList });
    });
    
    router.put('/:id', auth, async (req, res) => {
        await productContainer.updateProduct({
            id: req.params.id,
            name: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        });
        res.send(`se actualizó un producto con el id ${req.params.id}`);
    });
    
    router.delete('/:id', auth, async (req, res) => {
        await productContainer.deleteById(req.params.id);
        res.send(`producto con id ${req.params.id} eliminado`);
    });

};
