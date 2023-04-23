const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { Users } = require("../models");

chai.should();
chai.use(chaiHttp);

describe("Auth API", () => {
    describe("POST /signup", () => {
        it("should signUp", async () => {
            const response = await chai.request(app).post("/auth/signup").send({
                nickname: "saroball4",
                password: "11111",
                confirmPassword: "11111",
            });

            response.should.have.status(201);
            response.body.should.have.an("object");
            response.body.should.have.property("message");
        });
    });
    after(async () => {
        await Users.destroy({ where: { nickname: "saroball4" } });
    });
});

describe("Auth API", () => {
    let user;
    before(async () => {
        const response = await chai.request(app).post("/auth/signup").send({
            nickname: "saroball4",
            password: "11111",
            confirmPassword: "11111",
        });
    });

    describe("POST /login", () => {
        it("should login and get JWT", async () => {
            const response = await chai
                .request(app)
                .post("/auth/login")
                .send({ nickname: "saroball4", password: "11111" });

            response.should.have.status(200);
            response.body.should.be.an("object");
            response.body.should.have.property("token");
            response.body.token.should.be.a("string");
        });
    });
    after(async () => {
        await Users.destroy({ where: { nickname: "saroball4" } });
    });
});
