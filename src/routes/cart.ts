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

router.delete("/:itemId", removeFromCart);

router.delete("/clear", userMiddleware, clearCart);

export default router;
