import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt-helpers.js";
import { success, error } from "../utils/responseFormat.js";

export default {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      //   let mentor;
      //   let validMentorPassword;
      const user = await pool.query("SELECT * FROM users Where email = $1", [
        email,
      ]);
      const mentor = await pool.query(
        "SELECT * FROM mentors Where email = $1",
        [email]
      );
      console.log(user.rows[0]);
      console.log(mentor.rows[0]);
      if (user.rows.length === 0 && mentor.rows.length === 0)
        return res.status(401).json(error("Incorrect Email ", res.status));
      

      // Password Check
      if (user.rows.length === 0) {
        await bcrypt.compare(password, mentor.rows[0].password);
      } else if (mentor.rows.length === 0) {
        await bcrypt.compare(password, user.rows[0].password);
      } else {
        return res.status(401).json({ error: "Incorrect Password" });
      }

      let tokens = jwtTokens(user.rows[0] || mentor.rows[0]);
      res.cookie("refresh_token", tokens.refreshToken, { httpOnly: true });
      res.json(
        success("User is Successfully logged in", tokens, res.statusCode)
      );
    } catch (err) {
      console.log(err);
      res.status(401).json(error(err.message, res.statusCode));
    }
  },
};
