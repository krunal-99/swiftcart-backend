import express from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
} from "../controllers/authControllers";
import { signUpValidation } from "../middlewares/signUpValidation";
import { loginValidation } from "../middlewares/loginValidation";

const router = express.Router();

router.get("/register", getAllUsers);
router.post("/register", signUpValidation, registerUser);
router.post("/login", loginValidation, loginUser);

export default router;
