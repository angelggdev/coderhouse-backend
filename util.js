const env = require('dotenv').config();

module.exports = {
    DB_URL: process.env.DB_URL,
    SESSION_URL: process.env.SESSION_URL
}