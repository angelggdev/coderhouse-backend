const faker = require('faker');

module.exports = function (app) {
    const createProduct = () => {
        return {
            id: faker.random.alphaNumeric(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.random.image(),
        };
    };

    app.get('/api/productos-test', async (req, res) => {
        const list = [];
        for (let i = 0; i < 5; i++) {
            const product = createProduct();
            list.push(product);
        }
        const showList = list.length > 0 ? true : false;
        res.render('index-test.pug', { list: list, showList: showList });
    });
};
