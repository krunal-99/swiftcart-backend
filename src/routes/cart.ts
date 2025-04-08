import express from "express";
import {
  addToCart,
  clearCart,
  getAllCartItems,
  getCartByUser,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart";

const router = express.Router();

router.get("/", getAllCartItems);

router.post("/", addToCart);

router.get("/:userId", getCartByUser);

router.patch("/:itemId", updateCartItem);

router.delete("/:itemId", removeFromCart);

router.delete("/clear/:userId", clearCart);

export default router;
