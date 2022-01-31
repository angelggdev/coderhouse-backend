const ProductContainer = require('../controllers/productsController');

class ProductDao extends ProductContainer {
    constructor() {
        super();
    }
}

module.exports = ProductDao;