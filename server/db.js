import pg from "pg";

const { Pool } = pg;

let localPoolConfig = {
  user: "postgres",
  password: "Brenda@919",
  host: "localhost",
  port: "5432",
  database: "freementors",
};

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectiUnauthorized: false },
    }
  : localPoolConfig;


const pool = new Pool(poolConfig)

export default pool;