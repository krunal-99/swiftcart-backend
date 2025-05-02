import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, NODE_ENV } = process.env;

const isProduction = NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  entities: isProduction ? ["./dist/entities/*.js"] : ["./src/entities/*.ts"],
  synchronize: !isProduction,
  ssl: { rejectUnauthorized: false },
  migrations: isProduction
    ? ["./dist/migrations/*.js"]
    : ["./src/migrations/*.ts"],
});
