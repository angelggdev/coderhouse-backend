const ContainerFs = require('../../containers/ContainerFs');

class ProductsFsDao extends ContainerFs {
    constructor() {
        super('src/txt/products.txt');
    }
}

module.exports = ProductsFsDao;
