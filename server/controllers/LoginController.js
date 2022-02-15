import pool from '../db.js';
import bcrypt from 'bcrypt';


export default {
    async login(req,res) {
        try {
            const {email, password} = req.body;
           const users = await pool.query('SELECT * FROM users Where email = $1', [email]);
           if(users.rows.length === 0) return res.status(401).json({error: "Incorrect Email or Password"})

           //Password Check
           const validPassword = await bcrypt.compare(password, users.rows[0].password);
           if(!validPassword) return res.status(401).json({error: "Incorrect Email or Password"})
           return res.status(200).json("Successful Log in")

        } catch (error) {
            res.status(500).json({error:error.message})
        }
    },

    

    
}