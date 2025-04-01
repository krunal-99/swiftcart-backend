import express from "express";
import {
  getAdvertisements,
  getAllProducts,
  getFeaturedProducts,
  getFilteredProducts,
  getMaxProductPrice,
  getProductById,
} from "../controllers/product";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/filters", getFilteredProducts);

router.get("/max-price", getMaxProductPrice);

router.get("/featured", getFeaturedProducts);

router.get("/ad", getAdvertisements);

router.get("/:id", getProductById);

export default router;
