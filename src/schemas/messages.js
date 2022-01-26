const normalizr = require('normalizr');

const authorSchema = new normalizr.schema.Entity('author');
const messagesSchema = new normalizr.schema.Entity('messages', {
    messages: [{
        author: authorSchema
    }]
});

module.exports = messagesSchema;