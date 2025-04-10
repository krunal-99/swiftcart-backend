import { Request, Response } from "express";
import { orderRepo } from "../utils/services";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderRepo.find();

    res.status(201).json({ status: "success", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getOrderByUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const orders = await orderRepo.find({
      where: { users: { id: parseInt(id) } },
      relations: ["items"],
    });

    res.status(201).json({ status: "success", data: orders });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};
