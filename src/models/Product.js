const { options } = require('./options/db');
const knex = require('knex')(options);

knex.schema.createTable('products', table => {
    table.increments('id');
    table.string('name');
    table.string('thumbnail');
    table.integer('price');
})
    .then(() => console.log("table created"))
    .catch((err) => console.log(err))
    .finally(() => {
        knex.destroy();
    });

