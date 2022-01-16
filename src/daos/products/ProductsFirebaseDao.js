const ContainerFirebase = require('../../containers/ContainerFirebase');

class ProductsFirebaseDao extends ContainerFirebase {

    constructor(){
        super('products')
    }

}

module.exports = ProductsFirebaseDao;