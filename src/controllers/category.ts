import { Request, Response } from "express";
import { categoriesRepo } from "../services/services";

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await categoriesRepo.find({
    order: {
      id: "ASC",
    },
    relations: ["brands"],
  });
  res.json(categories);
};
