import express, { Request, Response } from "express";
import { AppDataSource } from "../services/db";
import { Products } from "../entities/Product";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const products = AppDataSource.getRepository(Products);
  const items = await products.find();
  res.json(items);
});

export default router;
