import pg from "pg";

const { Pool } = pg;



let localPoolConfig = {
  user: "postgres",
  password: "Brenda@919",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE,
};

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectiUnauthorized: false },
    }
  : localPoolConfig;

let pool = new Pool(poolConfig)
 

export default pool;