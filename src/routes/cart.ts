import express from "express";
import {
  getAllCartItems,
  getCartByUser,
  removeFromCart,
} from "../controllers/cart";

const router = express.Router();

router.get("/", getAllCartItems);

router.get("/:userId", getCartByUser);

router.delete("/:itemId", removeFromCart);

export default router;
