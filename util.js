const env = require('dotenv').config();

module.exports = {
    DB_URL: env.parsed.DB_URL,
    SESSION_URL: env.parsed.SESSION_URL
}