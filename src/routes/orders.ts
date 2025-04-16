import express from "express";
import {
  getAllOrders,
  getOrderById,
  getOrderByUsers,
  getOrderBySessionId,
} from "../controllers/orders";

const router = express.Router();

router.get("/", getAllOrders);

router.get("/:id", getOrderByUsers);

router.get("/order/:orderId", getOrderById);

router.get("/session/:sessionId", getOrderBySessionId);

export default router;
