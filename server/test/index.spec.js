import chai, { expect, assert } from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";
import deleteTestUser from "./helper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let should = chai.should();
chai.use(chaiHttp);

let testUser;
let decoded;

const getUser = (token) => {
 testUser = token
 decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
}

describe("User API Endpoints Test", () => {
  
  after( () => {
    
    deleteTestUser(testUser);
    
    
  })
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
        email: "brendapeters54@gmail.com",
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
          testUser = res.body
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body.data).to.have.property("accessToken");
          expect(res.body.message).to.equal("User Created Successfully");
          done();
          getUser(res.body.data.accessToken)
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
    });
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
          console.log(decoded)
        });
    });

    it("Should upgrade a user to Mentor", (done) => {
      let token =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiIyZDg0NTY0MC1kZjBjLTQ1NTktODQ3My05ZTVjOGJmMTgwYjIiLCJmaXJzdG5hbWUiOiJTdXBlciIsImxhc3RuYW1lIjoiQWRtaW4iLCJlbWFpbCI6InN1cGVyQWRtaW5AZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkSVRveGJIU05yOTNyM1EzWkpmdTAvdWhRQ3F2Vk83UndscEp6RDAvVTl2Z2hnUUxVTFBXQksiLCJhZGRyZXNzIjoiMzAgU2FudGliYW5leiBzdHJlZXQsIEFiYSIsImJpbyI6IkkgaGF2ZSBncmVhdCBwcm9ncmFtbWluZyBza2lsbHMiLCJvY2N1cGF0aW9uIjoic29mdHdhcmUgZGV2ZWxvcGVyIiwiZXhwZXJ0aXNlIjoiZXhwZXJ0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ3MTIxOTk0fQ.PYc-pWIWWb0h4QKyvFh_6YaVaVhdzDLeQTpRwsxjp50";
      chai
        .request(app)
        .patch(`/users/${decoded.userid}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal("User account changed to mentor");
          expect(res.body.data[0]).to.have.property("role").eql("mentor")
         console.log(err)
          done();
         
          
        });
    });
  });
});
