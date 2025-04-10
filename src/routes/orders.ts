import express from "express";
import { getAllOrders, getOrderByUsers } from "../controllers/orders";

const router = express.Router();

router.get("/", getAllOrders);

router.get("/:id", getOrderByUsers);

export default router;
