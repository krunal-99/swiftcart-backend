import express from "express";
import { getAvailableBrands } from "../controllers/brand";

const router = express.Router();

router.get("/", getAvailableBrands);

export default router;
