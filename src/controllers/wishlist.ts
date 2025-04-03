import { Request, Response } from "express";
import { wishlistRepo } from "../utils/services";

export const getAllWishlistItems = async (req: Request, res: Response) => {
  const wishlistItems = await wishlistRepo.find({ relations: ["product"] });

  res.status(201).json({ status: "success", data: wishlistItems });
};

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId, userId } = req.body;

  try {
    const wishlistEntry = await wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
      relations: ["product"],
    });
    if (wishlistEntry) {
      res.json("Item is already in wishlist");
      return;
    }
    const addedProduct = await wishlistRepo.save({
      productId,
      userId,
    });
    res.status(201).json({ status: "success", data: addedProduct });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal Server Error." });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const wishlistEntry = await wishlistRepo.findOne({
      where: { id },
    });
    if (!wishlistEntry) {
      res.status(404).json({ message: "Wishlist item not found" });
      return;
    }
    await wishlistRepo.remove(wishlistEntry);
    res
      .status(201)
      .json({ status: "success", data: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getWishListByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

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
