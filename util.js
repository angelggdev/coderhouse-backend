const env = require('dotenv').config();

module.exports = {
    API_URL: env.parsed.API_URL,
    SESSION_URL: env.parsed.SESSION_URL
}