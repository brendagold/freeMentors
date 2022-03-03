import pool from '../db.js';
import bcrypt from 'bcrypt';
import { success, error } from "../utils/responseFormat.js";



export default {
    async allMentors(req,res) {
        try {
           const mentors = await pool.query('SELECT mentorid, firstName, lastName, email,address,bio,occupation,expertise, role FROM mentors');
           res.status(200).json(success("All Mentors", mentors.rows, res.status))

        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    async createMentor(req, res) {
        try {
           const hashedPassword = await bcrypt.hash(req.body.password, 10);
           const newMentor = await pool.query("INSERT INTO mentors ( firstName, lastName, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *", [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, req.body.address, req.body.bio, req.body.occupation, req.body.expertise]) 
           res.status(200).json({mentor: newMentor.rows[0]})
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },



    async getMentorById(req, res) {
        try {
          const id = req.params.mentorid;
          const mentor = await pool.query("Select * From mentors WHERE mentorid = $1", [
            id,
          ]);
          
          if(mentor.rows[0] == null) {
            res.status(401).json(error("Mentor ID does not exist!", res.status))
          } 
          res.status(200).json(success("", mentor.rows[0] , res.status));
          
        } catch (err) {
          res.status(500).json(error(err.message, res.status));
        }
      },
    
    
}