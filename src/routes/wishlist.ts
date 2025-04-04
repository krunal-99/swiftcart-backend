import express from "express";
import {
  addToWishlist,
  getAllWishlistItems,
  getWishListByUserId,
  removeFromWishlist,
} from "../controllers/wishlist";

const router = express.Router();

router.get("/", getAllWishlistItems);

router.get("/:userId", getWishListByUserId);

router.post("/add", addToWishlist);

router.delete("/remove/:id", removeFromWishlist);

export default router;
