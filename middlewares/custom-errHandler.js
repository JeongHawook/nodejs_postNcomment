const AppError = require("../utils/customError");
const errorCodes = require("../config/error.json");

function errorHandler(err, req, res, next) {
    console.log(err);
    if (err instanceof AppError) {
        const errorDetails = errorCodes[err.errorCode];
        if (errorDetails) {
            const { statusCode, message } = errorDetails;
            return res.status(statusCode).json({ message });
        }
    }
    res.status(500).send("데이터 형식이 옳바르지않습니다");
}

module.exports = errorHandler;
