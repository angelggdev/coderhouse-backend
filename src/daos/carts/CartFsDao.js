const ContainerFs = require('../../containers/ContainerFs');

class CartFsDao extends ContainerFs {
    constructor() {
        super('../../txt/cart.txt');
    }
}

module.exports = CartFsDao;
