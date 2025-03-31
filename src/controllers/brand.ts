import { Request, Response } from "express";
import { brandsRepo } from "../services/services";

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandsRepo.find();
    res.json({ status: "success", data: brands });
  } catch (error) {
    res.json({ status: "failed", data: error });
  }
};

export const getBrandByCategoryId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brands = await brandsRepo.find({
      where: { categoryId: Number(id) },
      relations: ["category"],
    });
    res.json({ status: "success", data: brands });
  } catch (error) {
    res.json({ status: "failed", data: error });
  }
};
