import { Users } from "../entities/User";
import { AppDataSource } from "./db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Products } from "../entities/Product";
dotenv.config();

interface generateTokenProps {
  id: number;
  name: string;
  email: string;
}

export const userRepository = AppDataSource.getRepository(Users);

export const generateToken = ({ id, name, email }: generateTokenProps) => {
  return jwt.sign({ id, name, email }, "KJjdjkfnjkndsjkanhafuidnhfinhsad", {
    expiresIn: "30d",
  });
};
