import { Request, Response } from "express";
import { cartItemRepo, cartRepo } from "../utils/services";

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

export const removeFromCart = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  try {
    const itemToDelete = await cartItemRepo.findOne({
      where: { id: Number(itemId) },
      relations: ["product"],
    });
    if (!itemToDelete) {
      res.status(404).json({
        status: "failed",
        data: null,
        message: "Item not found in cart.",
      });
      return;
    }

    await cartItemRepo.delete(itemToDelete.id);

    res.status(201).json({
      status: "success",
      data: itemToDelete,
      message: `Item removed from cart successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      data: null,
      message: "Internal server error",
    });
  }
};
