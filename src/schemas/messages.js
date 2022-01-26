const normalizr = require('normalizr');

const authorSchema = new normalizr.schema.Entity('author');
const messageSchema = new normalizr.schema.Entity('message', {
    messages: [
        {
            authors: authorSchema
        }
    ]
});

module.exports = messageSchema;