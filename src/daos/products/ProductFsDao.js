const ContainerFs = require('../../containers/ContainerFs');

class ProductsFsDao extends ContainerFs {
    constructor() {
        super('../../txt/products.txt');
    }
}

module.exports = ProductsFsDao;
