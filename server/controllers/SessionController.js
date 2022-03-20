import pool from "../db.js";
import bcrypt from "bcrypt";
import { success, error } from "../utils/responseFormat.js";

export default {
  async allSessions(req, res) {
    try {
      const sessions = await pool.query("SELECT * FROM sessions");
      res.status(200).json(success("", sessions.rows, res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createSession(req, res) {
    try {
      const { mentorid, questions } = req.body;
      const { userid, email, firstname, lastname } = req.user;
      const mentor = await pool.query(
        "Select * From mentors WHERE mentorid = $1",
        [mentorid]
      );

      if (!mentor.rows[0]) {
        res.status(401).json(error("mentor not found", res.status));
      }
      const newSession = await pool.query(
        "INSERT INTO sessions ( mentorid, questions, menteeid, menteeEmail, menteeFullName) VALUES ($1, $2,$3,$4, $5) RETURNING *",
        [mentorid, questions, userid, email, firstname + " " + lastname]
      );

      res
        .status(200)
        .json(
          success(
            "Session created successfully",
            newSession.rows[0],
            res.status
          )
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async acceptSession(req, res) {
    try {
      const sessionid = req.params.sessionid;
      const update = "accepted";
      const response = await pool.query(
        "UPDATE sessions SET status = $1 WHERE sessionid = $2 RETURNING *",
        [update, sessionid]
      );
      if (!response.rows[0]) {
        res.status(401).json(error("Session Id not found", res.status));
      }

      res
        .status(200)
        .json(success("Request Accepted", response.rows[0], res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async rejectSession(req, res) {
    try {
      const sessionid = req.params.sessionid;
      const update = "rejected";
      const response = await pool.query(
        "UPDATE sessions SET status = $1 WHERE sessionid = $2 RETURNING *",
        [update, sessionid]
      );
      if (!response.rows[0]) {
        res.status(401).json(error("Session Id not found", res.status));
      }

      res
        .status(200)
        .json(success("Request Rejected", response.rows[0], res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async viewSessions(req, res) {
    try {
      const id = req.user.userid;
      let sessions;
      if (req.user.role == "user") {
        sessions = await pool.query(
          "Select * FROM sessions WHERE menteeid = $1",
          [id]
        );
      } else if (req.user.role == "mentor") {
        sessions = await pool.query(
          "Select * FROM sessions WHERE menteeid = $1",
          [id]
        );
      }

      if (sessions.rows == null) {
        res.status(404).json(error("No availabe sessions", res.status));
      }
      res.status(200).json(success("", sessions.rows, res.status));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async reviewSession(req, res) {
    try {
      const { score, remarks } = req.body;
      const { userid } = req.user;
      const { sessionid } = req.params;

      console.log(req.user);
      console.log(req.body);

      const mentee = await pool.query(
        "SELECT * FROM sessions WHERE menteeid = $1",
        [userid]
      );

      console.log(mentee.rows[0]);

      if (!mentee.rows[0]) {
        res.status(401).json(error("You have no session created", res.status));
      } else {
        const response = await pool.query(
          "UPDATE sessions SET remarks = $1, score = $2  WHERE sessionid = $3 RETURNING *",
          [remarks, score, sessionid]
        );
        if (!response.rows[0]) {
          res.status(401).json(error("Session Not found", res.status));
        }

        res
          .status(200)
          .json(
            success("Session Review Successful", response.rows[0], res.status)
          );
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async deleteReview(req, res) {
    try {
      const { sessionid } = req.params;
      const review = " ";

      const response = await pool.query(
        "UPDATE sessions SET remarks = $1  WHERE sessionid = $2 RETURNING *",
        [review, sessionid]
      );
      res
        .status(200)
        .json(
          success("Review successfully deleted", response.rows[0], res.status)
        );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
