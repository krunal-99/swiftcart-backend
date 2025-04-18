import express, { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/auth";
import { signUpValidation } from "../middlewares/signup";
import { loginValidation } from "../middlewares/login";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.get("/:id", getUserById);
router.get("/register", getAllUsers);
router.post("/register", signUpValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/verify", authMiddleware, async (req: Request, res: Response) => {
  res.status(200).json({ status: "success", data: "Token is valid" });
});
router.put("/:id", authMiddleware, updateUser);

export default router;
