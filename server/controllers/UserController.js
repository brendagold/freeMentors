import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";

export default {
  async allUsers(req, res) {
    try {
      const users = await pool.query("SELECT * FROM users");
      res.status(200).json({ users: users.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createUser(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await pool.query(
        "INSERT INTO users ( firstName, lastName, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [
          req.body.firstName,
          req.body.lastName,
          req.body.email,
          hashedPassword,
          req.body.address,
          req.body.bio,
          req.body.occupation,
          req.body.expertise,
        ]
      );

      let tokens = jwtTokens(newUser.rows[0]);
      res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
      res.status(200).json(tokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const id = req.params.userid;
      const user = await pool.query("Select * From users WHERE userid = $1", [
        id,
      ]);
      res.status(200).json({ user: user.rows });
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
          const currentUser = user.rows[0]
      
      const {firstname, lastname, email,password,address,bio,occupation,expertise} = currentUser;
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

      await pool.query(
        "DELETE FROM users WHERE userid = $1" , [id]
      )
        console.log(newMentor)
      res.status(200).send("User successfully upgraded")
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
