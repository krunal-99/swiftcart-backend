import express from "express";
import {
  clearCart,
  getAllCartItems,
  getCartByUser,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart";

const router = express.Router();

router.get("/", getAllCartItems);

router.get("/:userId", getCartByUser);

router.patch("/:itemId", updateCartItem);

router.delete("/:itemId", removeFromCart);

router.delete("/clear/:userId", clearCart);

export default router;
