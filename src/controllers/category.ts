import { Request, Response } from "express";
import { categoriesRepo } from "../utils/services";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoriesRepo.find({
      order: {
        id: "ASC",
      },
      relations: ["brands"],
    });
    res.status(200).json({ status: "success", data: categories });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(400).json({ status: "failed", message: error });
  }
};
