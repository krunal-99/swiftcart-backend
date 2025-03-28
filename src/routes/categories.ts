import express, { Request, Response } from "express";
import { categoriesRepo } from "../services/services";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const categories = await categoriesRepo.find();
  res.json(categories);
});

export default router;
