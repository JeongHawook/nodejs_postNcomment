const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("API Endpoints", () => {
    let server;

    before((done) => {
        server = app.listen(3100, () => {
            console.log("Server started on port 3000");
            done();
        });
    });

    after(() => {
        server.close(() => {
            console.log("Server stopped");
        });
    });

    describe("POST /signup", () => {
        it("should return a 201 status code when the request is successful", (done) => {
            chai.request(app)
                .post("posts/signup")
                .send({
                    nickname: "testuser",
                    password: "testpassword",
                    confirmPassword: "testpassword",
                })
                .end((err, res) => {
                    chai.expect(res).to.have.status(201);
                    done();
                });
        });
    });

    describe("POST /login", () => {
        it("should return a token when the request is successful", (done) => {
            chai.request(app)
                .post("/login")
                .send({ nickname: "testuser", password: "testpassword" })
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body).to.have.property("token");
                    done();
                });
        });
    });
});
