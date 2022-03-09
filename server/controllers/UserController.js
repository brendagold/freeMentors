import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { RegisterValidation } from "../utils/joiSchemas.js";
import { success, error } from "../utils/responseFormat.js";

export default {
  async allUsers(req, res) {
    try {
      const users = await pool.query(
        "SELECT userid, firstName, lastName, email,address,bio,occupation,expertise, role FROM users"
      );
      res
        .status(200)
        .json(
          success(
            "",
            users.rows,
            res.statusCode
          )
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req, res) {
    try {
        const {error, value} = RegisterValidation(req.body);
        
          if (error) {
            return res.status(400).send(error.details[0].message);
          } else {
      const hashedPassword = await bcrypt.hash(value.password, 10);
      const {
        firstname,
        lastname,
        email,
        address,
        bio,
        occupation,
        expertise,
      } = value;
      const newUser = await pool.query(
        "INSERT INTO users ( firstname, lastname, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
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
            tokens,
            res.statusCode
          )
        );
          }
    } catch (e) {
      res.status(500).json(error(e.message, res.status ));
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query(
        "Select userid, firstname, lastname, email,address,bio,occupation,expertise,role From users WHERE userid = $1",
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
      const newRole = "mentor"
      const newMentor = await pool.query(
        "INSERT INTO mentors ( firstname, lastname, email,password,address,bio,occupation,expertise,role) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
        [
          firstname,
          lastname,
          email,
          password,
          address,
          bio,
          occupation,
          expertise,
          newRole
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
