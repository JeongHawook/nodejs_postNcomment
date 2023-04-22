const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const user = require("../schemas/user");

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;

    const [authType, authToken] = (Authorization ?? "").split(" ");

    if (authType !== "Bearer" || !authToken) {
        res.status(403).json({
            errorMessage: "로그인 후에 이용할수있는 기능입니다",
        });

        return;
    }

    try {
        const { nickname, userId } = jwt.verify(
            authToken,
            process.env.JWT_SECRET
        );

        res.locals.user = { nickname, userId };

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다",
        });
    }
};
