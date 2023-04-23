const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { Users } = require("../models");

chai.should();
chai.use(chaiHttp);

describe("Comments API", () => {
    describe("GET /comments", () => {
        it("should get all comments", async () => {
            const postId = 3;
            const response = await chai
                .request(app)
                .get(`/posts/${postId}/comments`);

            response.body.should.have.status(200);
            response.body.should.be.an("object");
            response.body.should.have.property("comments");
            response.body.comments.should.be.an("array");
        });
    });
});
