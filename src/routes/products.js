
const router = Router();

app.get('/', async (req, res) => {
    const list = await contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('index.pug', { list: list, showList: showList });
});

router.get('/', async (req, res) => {
    const list = await contenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('productos.pug', { list: list, showList: showList });
});

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await contenedor.getById(id);
    item ? res.send(item) : res.send({ error: 'producto no encontrado' });
});

router.post('/', async (req, res) => {
    await contenedor.save({
        name: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    });
    const list = awaitcontenedor.getAll();
    const showList = list.length > 0 ? true : false;
    res.render('productos.pug', { list: list, showList: showList });
});

router.put('/:id', async (req, res) => {
    await contenedor.save({
        id: parseInt(req.params.id),
        name: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    });
    res.send(`se actualizó un producto con el id ${req.params.id}`);
});

router.delete('/:id', async (req, res) => {
    await contenedor.deleteById(parseInt(req.params.id));
    res.send(`producto con id ${req.params.id} eliminado`);
});

app.use('/api/productos', router);