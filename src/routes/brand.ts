import express from "express";
import { getAllBrands, getBrandByCategoryId } from "../controllers/brand";

const router = express.Router();

router.get("/", getAllBrands);
router.get("/:id", getBrandByCategoryId);

export default router;
