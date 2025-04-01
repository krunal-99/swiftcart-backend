import { Request, Response } from "express";
import argon2 from "argon2";
import { generateToken, userRepo } from "../utils/services";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepo.find();
    if (users.length === 0) {
      res.json({ status: "failed", data: "No users found." });
    } else {
      res.json({ status: "success", data: users });
    }
  } catch (error) {
    res.json({ status: "failed", data: "Interval Server Error." });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, imageUrl, email, password } = req.body;
  const userExists = await userRepo.findOne({ where: { email } });
  if (userExists) {
    res.json({ status: "failed", data: "User already exists." });
    return;
  }
  const hashedPassword = await argon2.hash(password);
  const newUser = { name, imageUrl, email, password: hashedPassword };
  try {
    const userSaved = await userRepo.save(newUser);
    res.json({ status: "success", data: "User registered successfully." });
  } catch (error) {
    res.json({ status: "failed", data: "Interval Server Error." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const userExists = await userRepo.findOne({ where: { email } });

  if (!userExists) {
    res.json({ status: "failed", data: "Email doesn't exists." });
    return;
  }

  const isUserValid = await argon2.verify(userExists.password, password);

  if (isUserValid) {
    const token = generateToken({
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
    });
    res.json({
      status: "success",
      data: "Login successful.",
      token: token,
      name: userExists.name,
      imageUrl: userExists.imageUrl,
    });
  } else {
    res.json({ status: "failed", data: "Invalid credentials." });
  }
};
