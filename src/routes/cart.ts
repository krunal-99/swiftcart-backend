import express from "express";
import { getAllCartItems, getCartByUser } from "../controllers/cart";

const router = express.Router();

router.get("/", getAllCartItems);

router.get("/:userId", getCartByUser);

export default router;
