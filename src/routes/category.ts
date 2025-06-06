import express from "express";
import { getAllCategories } from "../controllers/category";

const router = express.Router();

router.get("/", getAllCategories);

export default router;
