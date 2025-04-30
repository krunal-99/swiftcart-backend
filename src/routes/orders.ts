import express from "express";
import {
  getOrderById,
  getOrderByUsers,
  getOrderBySessionId,
} from "../controllers/orders";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/", authMiddleware, getOrderByUsers);

router.get("/order/:orderId", getOrderById);

router.get("/session/:sessionId", getOrderBySessionId);

export default router;
