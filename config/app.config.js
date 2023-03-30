const dotenv = require('dotenv');
dotenv.config();
const MONGO_DB_CONFIG = {
    // DB: "mongodb://127.0.0.1:27017/grocery-app-db",
    DB: process.env.URL,
    PAGE_SIZE: 10,
};
module.exports = {
    MONGO_DB_CONFIG,
};