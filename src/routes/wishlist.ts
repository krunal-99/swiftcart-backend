import express from "express";
import {
  addToWishlist,
  getWishListByUserId,
  removeFromWishlist,
} from "../controllers/wishlist";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware, getWishListByUserId);

router.post("/add", authMiddleware, addToWishlist);

router.delete("/remove/:id", removeFromWishlist);

export default router;
