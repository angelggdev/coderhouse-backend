const env = require('dotenv').config();

module.exports = {
    DB_URL: process.env.parsed.DB_URL,
    SESSION_URL: process.env.parsed.SESSION_URL
}