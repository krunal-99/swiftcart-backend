import express from "express";
import {
  addToCart,
  clearCart,
  getCartByUser,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart";
import { authMiddleware, userMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/", userMiddleware, getCartByUser);

router.post("/", authMiddleware, addToCart);

router.patch("/:itemId", updateCartItem);

router.delete("/clear", authMiddleware, clearCart);

router.delete("/:itemId", removeFromCart);

export default router;
