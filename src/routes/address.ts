import express from "express";
import { authMiddleware } from "../middlewares/auth";
import { createAddress, getUserAddresses } from "../controllers/address";

const router = express.Router();

router.post("/", authMiddleware, createAddress);
router.get("/user", authMiddleware, getUserAddresses);

export default router;
