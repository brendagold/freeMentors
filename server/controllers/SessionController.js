import pool from "../db.js";
import bcrypt from "bcrypt";

export default {
  async allSessions(req, res) {
    try {
      const sessions = await pool.query("SELECT * FROM sessions");
      res.json({ sessions: sessions.rows });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createSession(req, res) {
    try {
      const newUser = await pool.query(
        "INSERT INTO sessions ( mentorid, questions, menteeid, menteeEmail) VALUES ($1, $2,$3,$4) RETURNING *",
        [req.body.mentorid, req.body.questions, req.user.userid, req.user.email]
      );

      res.json({ sessions: newUser.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async acceptSession(req, res) {
    try {
      const sessionid = req.params.sessionid;
      const update  = "accepted";
      const response = await pool.query(
        "UPDATE sessions SET status = $1 WHERE sessionid = $2 RETURNING *",
        [update, sessionid]
      );

      res.json({ data: response.rows[0]})
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async rejectSession(req, res) {
    try {
        const sessionid = req.params.sessionid;
        const update  = "rejected";
        const response = await pool.query(
          "UPDATE sessions SET status = $1 WHERE sessionid = $2 RETURNING *",
          [update, sessionid]
        );
  
        res.json({ data: response.rows[0]})
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  },
};
