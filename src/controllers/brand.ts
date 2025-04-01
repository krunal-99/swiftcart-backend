import { Request, Response } from "express";
import { brandsRepo } from "../utils/services";

export const getAvailableBrands = async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.query.category as string, 10) || 1;

    let brands;
    if (categoryId > 1) {
      brands = await brandsRepo.find({
        where: { categoryId },
        order: { name: "ASC" },
      });
    } else {
      brands = await brandsRepo.find({
        order: { name: "ASC" },
      });
    }
    res.status(200).json({ status: "success", data: brands });
  } catch (error) {
    console.error("Error in getAvailableBrands:", error);
    res.status(400).json({ status: "failed", message: error });
  }
};
