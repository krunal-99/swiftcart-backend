import { Users } from "../entities/User";
import { AppDataSource } from "./db";
import jwt from "jsonwebtoken";

interface generateTokenProps {
  id: number;
  name: string;
  email: string;
}

export const userRepository = AppDataSource.getRepository(Users);

export const generateToken = ({ id, name, email }: generateTokenProps) => {
  if (!process.env.SECRET) {
    throw new Error("SECRET environment variable is not defined");
  }
  return jwt.sign({ id, name, email }, process.env.SECRET, {
    expiresIn: "30d",
  });
};
