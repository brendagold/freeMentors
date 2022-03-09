import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import deleteTestUser from "./helper.js";

let should = chai.should();
chai.use(chaiHttp);


describe("User API Endpoints Test", () => {
  context("/GET users", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(app)
        .get("/api/users")
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          res.body.should.be.a("object");
          expect(res.body.data[0]).to.have.property("firstname");
          done();
        });
    });

    it("Should get user by Id", (done) => {
      chai
        .request(app)
        .get("/users/92978806-aa62-43ef-affb-9a6f1919381a")
        .end((err, res) => {
          expect(res.status).to.equal(200);
          res.body.should.be.a("object");
          expect(res.body.data).to.have.property("firstname").eql("Brenda");
          expect(res.body.data).to.have.property("role");
          done();
        });
    });
  });

  context("/POST User", () => {
    it("Create a user", (done) => {
      const payload = {
        firstname: "Brenda",
        lastname: "Gold",
        email: "brendapeters@gmail.com",
        password: "Brenda919",
        address: "45 kindness street",
        bio: "Bespoke Barber",
        occupation: "Barber",
        expertise: "expert",
      };
      chai
        .request(app)
        .post("/auth/signup")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body.data).to.have.property("accessToken");
          expect(res.body.message).to.equal("User Created Successfully");
          done();
          deleteTestUser(res.body.data.accessToken)
          
        });

        
    });

    it("Should Not Create a user", (done) => {
      const payload = {
        firstname: "Brenda",
        lastname: "Gold",
        email: "brendag@gmail.com",
        password: "Brenda919",
        address: "45 kindness street",
        bio: "Bespoke Barber",
        occupation: "Barber",
        expertise: "expert",
      };
      chai
        .request(app)
        .post("/auth/signup")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          expect(res.body.message).to.equal(
            'duplicate key value violates unique constraint "users_email_key"'
          );
          done();
        });
    });

    it("Should Login a User", (done) => {
      const payload = {
        email: "brendag3@gmail.com",
        password: "Brenda919",
        
      };
      chai
        .request(app)
        .post("/auth/signin")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body.data).to.have.property("accessToken");
          expect(res.body.message).to.equal("User is Successfully logged in");
          done();
          
        });
    })
    it("Should not Login a User", (done) => {
      const payload = {
        email: "brenda@gmail.com",
        password: "great123",
        
      };
      chai
        .request(app)
        .post("/auth/signin")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
          expect(res.body.message).to.equal("Incorrect Email or Password");
          done();
          
        });
    })

    it("Should upgrade a user to Mentor", (done) => {
      
      chai
        .request(app)
        .patch("/users/92978806-aa62-43ef-affb-9a6f1919381a")
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          res.body.should.be.a("object");
          expect(res.body.data).to.have.property("firstname").eql("Brenda");
          expect(res.body.data).to.have.property("role");
          done();
        });
    })
  });
});
