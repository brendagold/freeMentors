import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { schema } from "../utils/joiSchemas.js";
import Joi from "joi";
import { success, error } from "../utils/responseFormat.js";

export default {
  async allUsers(req, res) {
    try {
      const users = await pool.query(
        "SELECT userid, firstName, lastName, email,address,bio,occupation,expertise FROM users"
      );
      res
        .status(200)
        .json(
          success(
            "User Created Successfully",
            { users: users.rows },
            res.statusCode
          )
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req, res) {
    try {
      //   schema.validate(req.body, (err, result) => {
      //     if (err) {
      //       res.send("An error occurred");
      //     }
      //     console.log(result);
      //     res.send("successful integration");
      //   });
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const {
        firstname,
        lastname,
        email,
        address,
        bio,
        occupation,
        expertise,
      } = req.body;
      const newUser = await pool.query(
        "INSERT INTO users ( firstName, lastName, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [
          firstname,
          lastname,
          email,
          hashedPassword,
          address,
          bio,
          occupation,
          expertise,
        ]
      );

      let tokens = jwtTokens(newUser.rows[0]);
      res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
      res
        .status(200)
        .json(
          success(
            "User Created Successfully",
            { tokens: tokens },
            res.statusCode
          )
        );
    } catch (e) {
      res.status(500).json(error(e.message, res.status ));
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query(
        "Select userid, firstName, lastName, email,address,bio,occupation,expertise From users WHERE userid = $1",
        [id]
      );
      if (user.rows[0] == null) {
        res.status(404).json(error("user not found", res.status));
      }
      res.status(200).json(success("", user.rows[0] , res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async upgradeUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query("Select * From users WHERE userid = $1", [
        id,
      ]);
      if (!user.rows[0]) {
        res.status(404).json(error("user does not exist", res.status));
      } else {
      const currentUser = user.rows[0];

      const {
        firstname,
        lastname,
        email,
        password,
        address,
        bio,
        occupation,
        expertise,
      } = currentUser;
      
      const newMentor = await pool.query(
        "INSERT INTO mentors ( firstname, lastname, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [
          firstname,
          lastname,
          email,
          password,
          address,
          bio,
          occupation,
          expertise,
        ]
      );

      await pool.query("DELETE FROM users WHERE userid = $1", [id]);

      res
        .status(200)
        .json(
          success(
            "User account changed to mentor",
            { mentor: newMentor.rows },
            res.statusCode
          )
        );
          }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
