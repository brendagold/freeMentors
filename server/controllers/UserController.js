import pool from '../db.js';
import bcrypt from 'bcrypt';


export default {
    async allUsers(req,res) {
        try {
           const users = await pool.query('SELECT * FROM users');
           res.json({users: users.rows})

        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    async createUser(req, res) {
        try {
           const hashedPassword = await bcrypt.hash(req.body.password, 10);
           const newUser = await pool.query("INSERT INTO users ( firstName, lastName, email,password,address,bio,occupation,expertise) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *", [req.body.firstName, req.body.lastName, req.body.email, hashedPassword, req.body.address, req.body.bio, req.body.occupation, req.body.expertise]) 
           res.json({users: newUser.rows[0]})
        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    
}