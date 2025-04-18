import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  entities: ["./dist/entities/*.js"],
  synchronize: true,
  ssl: { rejectUnauthorized: false },
});
