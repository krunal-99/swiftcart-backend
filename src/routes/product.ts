import express from "express";
import {
  getAdvertisements,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
} from "../controllers/product";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/featured", getFeaturedProducts);

router.get("/ad", getAdvertisements);

router.get("/:id", getProductById);

export default router;
