const ContainerFs = require('ContainerFs');

class CartFsDao extends ContainerFs {

    constructor(){
        super('../../txt/cart.txt')
    }

}

module.exports = CartFsDao;