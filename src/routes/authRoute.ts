import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/authControllers";

const router = express.Router();

router.get("/register", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
