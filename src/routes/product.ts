import express from "express";
import {
  getAdvertisements,
  getFeaturedProducts,
  getFilteredProducts,
  getMaxProductPrice,
  getProductById,
  getRandomProducts,
} from "../controllers/product";
import { userMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/", getRandomProducts);

router.get("/filters", getFilteredProducts);

router.get("/max-price", getMaxProductPrice);

router.get("/featured", getFeaturedProducts);

router.get("/ad", getAdvertisements);

router.get("/:id", userMiddleware, getProductById);

export default router;
