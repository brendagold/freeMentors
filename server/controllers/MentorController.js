import pool from '../db.js';
import bcrypt from 'bcrypt';


export default {
    async allMentors(req,res) {
        try {
           const mentors = await pool.query('SELECT * FROM mentors');
           res.json({mentors: mentors.rows})

        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    async createMentor(req, res) {
        try {
           const hashedPassword = await bcrypt.hash(req.body.password, 10);
           const newMentor = await pool.query("INSERT INTO mentors ( firstName, lastName, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *", [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, req.body.address, req.body.bio, req.body.occupation, req.body.expertise]) 
           res.json({mentor: newMentor.rows[0]})
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
          res.status(200).json({ mentor: mentor.rows[0] });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },

    
}