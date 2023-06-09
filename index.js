const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGO_DB_CONFIG } = require("./config/app.config");
const errors = require("./middleware/errors.js");
const swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./swagger.json");

mongoose.Promise = global.Promise;
async function connect() {
    await mongoose.connect(MONGO_DB_CONFIG.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(
            () => {
                console.log("Database connected");
            },
            (error) => {
                console.log("Database cant be connected: " + error);
            }

        );

}
connect();

app.use(express.json());
// app.use("/uploads", express.static("uploads"));
app.use("/api", require("./routes/app.routes"))
app.use(errors.errorHandler);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 4000, function () {
    console.log("Ready to Go")
});