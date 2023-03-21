const uri = "mongodb+srv://deepaksardana03:Deepak123@groceryappcluster.wc8gpqp.mongodb.net/?retryWrites=true&w=majority";

const MONGO_DB_CONFIG = {
    // DB: "mongodb://127.0.0.1:27017/grocery-app-db",
    DB: uri,
    PAGE_SIZE: 10,
};
module.exports = {
    MONGO_DB_CONFIG,
};