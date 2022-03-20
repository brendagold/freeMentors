import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

let localPoolConfig = {
  user: process.env.DATABASE_DBUSER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.TESTDB,
};

let testPoolConfig = {
  user: process.env.DATABASE_DBUSER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.TESTDB,
};

let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
} else if (process.env.NODE_ENV == "test") {
  poolConfig = testPoolConfig;
} else {
  poolConfig = localPoolConfig;
}

let pool = new Pool(poolConfig);

export default pool;
