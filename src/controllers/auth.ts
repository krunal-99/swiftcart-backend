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
  try {
    const { name, imageUrl, email, password } = req.body;
    const userExists = await userRepo.findOne({ where: { email } });
    if (userExists) {
      res.json({ status: "failed", data: "User already exists." });
      return;
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = { name, imageUrl, email, password: hashedPassword };
    const userSaved = await userRepo.save(newUser);

    const token = generateToken({
      id: userSaved.id,
      name: userSaved.name,
      email: userSaved.email,
      imageUrl: userSaved.imageUrl,
    });

    res.status(201).json({
      status: "success",
      data: "User registered successfully",
      token,
      user: { id: userSaved.id, name, email, imageUrl },
    });
    res.json({ status: "failed", data: "Interval Server Error." });
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal Server Error." });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userExists = await userRepo.findOne({ where: { email } });

    if (!userExists) {
      res.json({ status: "failed", data: "Email doesn't exists." });
      return;
    }

    const isUserValid = await argon2.verify(userExists.password, password);
    const user = {
      id: userExists.id,
      name: userExists.name,
      email: userExists.email,
      imageUrl: userExists.imageUrl,
    };
    if (isUserValid) {
      const token = generateToken({
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        imageUrl: userExists.imageUrl,
      });
      res.json({
        status: "success",
        data: "Login successful.",
        token: token,
        user: user,
      });
    } else {
      res.json({ status: "failed", data: "Invalid credentials." });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", data: "Internal Server Error" });
  }
};
