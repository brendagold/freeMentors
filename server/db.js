import pg from "pg";
import dotenv from 'dotenv';


dotenv.config();
const { Pool } = pg;



let localPoolConfig = {
  user: process.env.DATABASE_DBUSER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
};
 console.log(process.env.DATABASE_PASSWORD)
 console.log(process.env.DATABASE_PORT)
 //console.log(process.env)
 console.log(process.env.ACCESS_TOKEN_SECRET)
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectiUnauthorized: false },
    }
  : localPoolConfig;

let pool = new Pool(poolConfig)
 

export default pool;