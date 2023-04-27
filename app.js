const express = require("express");
const app = express();
require("dotenv").config();
const port = 3300;
const errorHandler = require("./middlewares/custom-errHandler");
const routes = require("./routes/index");
const connect = require("./schemas");
//const errorHandler = require("errorhandler");
const cookieParser = require("cookie-parser");
const { swaggerUi, specs } = require("./modules/swagger");
//connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", routes);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});

module.exports = app;
