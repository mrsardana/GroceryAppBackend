const dotenv = require('dotenv');
dotenv.config();
const MONGO_DB_CONFIG = {
    // DB: "mongodb://127.0.0.1:27017/grocery-app-db",
    DB: process.env.URL,
    PAGE_SIZE: 10,
};
const STRIPE_CONFIG = {
    STRIPE_KEY: process.env.STRIPE_KEY,
    CURRENCY: "cad"
}
module.exports = {
    MONGO_DB_CONFIG,
    STRIPE_CONFIG
};