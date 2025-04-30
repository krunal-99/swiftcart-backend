import { Request, Response } from "express";
import argon2 from "argon2";
import { generateToken, userRepo } from "../utils/services";
import { deleteCloudinaryImage, uploadToCloudinary } from "../utils/cloudinary";

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

export const getUserById = async (req: Request, res: Response) => {
  const id = req.user?.id;

  try {
    const user = await userRepo.findOne({
      where: { id: parseInt(id!) },
      relations: ["addresses"],
    });
    if (!user) {
      res.status(404).json({ status: "failed", message: "User not found" });
    } else {
      res.status(201).json({ status: "success", data: user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error." });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.user?.id;
    const { name, email, password, imageUrl } = req.body;

    const user = await userRepo.findOne({
      where: { id: parseInt(id!) },
      relations: ["addresses"],
    });

    if (!user) {
      res.status(404).json({ status: "failed", data: "User not found." });
      return;
    }

    if (email && email !== user.email) {
      const emailExists = await userRepo.findOne({ where: { email } });
      if (emailExists) {
        res
          .status(400)
          .json({ status: "failed", data: "Email already in use." });
        return;
      }
    }

    if (imageUrl) {
      try {
        if (user.imageUrl) {
          await deleteCloudinaryImage(user.imageUrl);
        }
        const newImageUrl = await uploadToCloudinary(imageUrl);
        user.imageUrl = newImageUrl;
      } catch (error) {
        console.error("Error handling image:", error);
        res.status(500).json({
          status: "failed",
          data: "Failed to process image. Please try again.",
        });
        return;
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password && password.trim() !== "") {
      user.password = await argon2.hash(password);
    }

    const updatedUser = await userRepo.save(user);
    const { password: _, ...userWithoutPassword } = updatedUser;

    const token = generateToken({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      imageUrl: updatedUser.imageUrl,
    });

    res.status(200).json({
      status: "success",
      data: "User updated successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ status: "failed", data: "Internal Server Error." });
  }
};
