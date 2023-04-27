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

    it("should return an error when missing required fields", async () => {
        const response = (await chai.request(app).post("/auth/signup")).send({
            password: "11111",
            confirmPassword: "11111",
        });
        response.should.have.status(400);
        response.body.should.have.property("errorMessage");
    });
    it("should return an error when password is too short", async () => {
        const response = (await chai.request(app).post("/auth/signup")).send({
            nickname: "saroball5",
            password: "11",
            confirmPassword: "11",
        });
        response.should.have.status(401);
        response.body.should.have.an("object");
        response.body.should.have.property("message");
    });
    it("should return an error when password and confirmPassword arent in match", async () => {});
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
