import { Request, Response } from "express";
import { wishlistRepo } from "../utils/services";

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.user?.id;
  try {
    const wishlistEntry = await wishlistRepo.findOne({
      where: { user: { id: parseInt(userId!) }, product: { id: productId } },
      relations: ["product"],
    });
    if (wishlistEntry) {
      res.json("Item is already in wishlist");
      return;
    }
    await wishlistRepo.save({
      userId: Number(userId),
      productId: Number(productId),
    });
    res.status(201).json({
      status: "success",
      data: "Item added successfully to wishlist.",
    });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal Server Error." });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const wishlistEntry = await wishlistRepo.findOne({
      where: { id: Number(id) },
    });
    if (!wishlistEntry) {
      res.status(404).json({ message: "Wishlist item not found" });
      return;
    }
    const deletedItem = await wishlistRepo.remove(wishlistEntry);
    res.status(201).json({
      status: "success",
      data: deletedItem,
      message: "Item removed successfully from wishlist",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getWishListByUserId = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  try {
    const wishlistEntry = await wishlistRepo.find({
      where: { user: { id: Number(userId) } },
      relations: ["product"],
    });
    if (!wishlistEntry) {
      res
        .status(404)
        .json({ status: "failed", data: "No products found in wishlist" });
    } else {
      res.status(201).json({ status: "success", data: wishlistEntry });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal Server Error" });
  }
};
