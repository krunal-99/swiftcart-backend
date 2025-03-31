import { Request, Response } from "express";
import { productsRepo } from "../services/services";
import { In } from "typeorm";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const items = await productsRepo.find();
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const featured = await productsRepo.find({ where: { id: In([16, 67]) } });
    res.status(200).json({ status: "success", data: featured });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getAdvertisements = async (req: Request, res: Response) => {
  try {
    const adData = await productsRepo.find({ where: { id: In([46, 88]) } });
    res.status(200).json({ status: "success", data: adData });
  } catch (error) {
    res.status(400).json({ status: "failed", data: error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await productsRepo.find({
      where: { id: Number(id) },
      relations: ["reviews"],
    });
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "failed", data: error });
  }
};
