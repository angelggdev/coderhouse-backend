const ContainerFs = require('../../containers/ContainerFs');

class CartFsDao extends ContainerFs {
    constructor() {
        super('src/txt/cart.txt');
    }
}

module.exports = CartFsDao;
