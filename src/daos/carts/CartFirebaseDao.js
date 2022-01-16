const ContainerFirebase = require('../../containers/ContainerFirebase');

class CartFirebaseDao extends ContainerFirebase {

    constructor(){
        super('cart')
    }

}

module.exports = CartFirebaseDao;