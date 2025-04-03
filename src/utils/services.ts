import { Brand } from "../entities/Brand";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Review } from "../entities/Review";
import { Users } from "../entities/User";
import { Wishlist } from "../entities/Wishlist";
import { AppDataSource } from "./db";
import jwt from "jsonwebtoken";
import { generateTokenProps } from "./types";

export const userRepo = AppDataSource.getRepository(Users);
export const productsRepo = AppDataSource.getRepository(Product);
export const categoriesRepo = AppDataSource.getRepository(Category);
export const brandsRepo = AppDataSource.getRepository(Brand);
export const reviewsRepo = AppDataSource.getRepository(Review);
export const wishlistRepo = AppDataSource.getRepository(Wishlist);

export const generateToken = (payload: generateTokenProps) => {
  if (!process.env.SECRET) {
    throw new Error("SECRET environment variable is not defined");
  }
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn: "24h",
  });
};
