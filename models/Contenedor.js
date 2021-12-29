const { options } = require('../options/db');
const knex = require('knex')(options);

class Contenedor {
    constructor(tableName) {
        this.tableName = tableName;
    }

    async save(product) {
        if (product.id) {
            try {
                await knex
                    .from(this.tableName)
                    .where('id', product.id)
                    .update({ ...product });
            } catch (err) {
                console.log(err);
            }
            return product.id;
        } else {
            let id;
            await knex(this.tableName)
                .insert(product)
                .then((data) => (id = data[0]))
                .catch((err) => console.log(err));
            return id;
        }
    }

    async getById(number) {
        let object;
        try {
            object = await knex
                .from(this.tableName)
                .select('*')
                .where('id', number);
        } catch (err) {
            console.log(err);
        }
        if (object.length) {
            return object;
        } else {
            return null;
        }
    }

    async getAll() {
        let list = [];
        try {
            list = await knex.from(this.tableName).select('*');
        } catch (err) {
            console.log(err);
        }
        return list;
    }

    async deleteById(number) {
        try {
            await knex.from(this.tableName).where('id', number).del();
        } catch (err) {
            console.log(err);
        }
    }

    deleteAll() {
        try {
            knex.from(this.tableName).del();
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Contenedor;
