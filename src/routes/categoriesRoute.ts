import express, { Request, Response } from "express";
import { AppDataSource } from "../services/db";
import { Category } from "../entities/Category";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const categoriesRepo = AppDataSource.getRepository(Category);
  const categories = await categoriesRepo.find();
  res.json(categories);
});

export default router;
