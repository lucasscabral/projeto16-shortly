import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORTPG,
  database: process.env.DATABASE,
};

const connection = new Pool(config);

export default connection;
