import { Request, Response } from "express";
import { cartRepo } from "../utils/services";

export const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const cartItems = await cartRepo.find({
      relations: ["items", "user"],
    });
    res.status(201).json({ status: "success", data: cartItems });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal server error." });
  }
};

export const getCartByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [cartItems, totalCount] = await cartRepo.findAndCount({
      where: { user: { id: Number(userId) } },
      relations: ["items", "items.product"],
    });
    res.status(201).json({ status: "success", data: cartItems, totalCount });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal server error." });
  }
};
