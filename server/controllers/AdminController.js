import pool from "../db.js";
import { success, error } from "../utils/responseFormat.js";

export default {
  async createAdmin(req, res) {
    try {
      const id = req.params.id;
      const update = "admin";
      const response = await pool.query(
        "UPDATE users SET role = $1 WHERE userid = $2 RETURNING userid, firstname, lastname, email,address,bio,occupation,expertise, role",
        [update, id]
      );
      if (!response.rows[0]) {
        res.status(401).json(error("User Id not found", res.status));
      }

      res
        .status(200)
        .json(success("Admin Created", response.rows[0], res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async allAdmins (req, res) {
    try {
      const role = "admin"
      const admins = await pool.query(
        "Select userid, firstname, lastname, email,address,bio,occupation,expertise,role From users WHERE role = $1",
        [role]
      );
      res
      .status(200)
      .json(
        success(
          "",
          admins.rows,
          res.statusCode
        )
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
