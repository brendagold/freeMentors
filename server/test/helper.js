import pool from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const deleteTestUser = async (token) => {
  let testUser = {}
    
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return res.status(403).json({ error: error.message });
      testUser = user;
       
    });
      
    await pool.query("DELETE FROM users WHERE userid = $1", [testUser.userid]);
}

export default deleteTestUser