import { Request, Response } from "express";
import argon2 from "argon2";
import { addressRepo, generateToken, userRepo } from "../utils/services";
import {
  deleteImage,
  getPublicIdFromUrl,
  uploadImage,
} from "../utils/cloudinary";
import { Address } from "../entities/Address";

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
  const { id } = req.params;

  try {
    const user = await userRepo.findOne({
      where: { id: parseInt(id) },
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
    const {
      name,
      email,
      password,
      street,
      city,
      pincode,
      country,
      state,
      userId,
      firstName,
      lastName,
    } = req.body;
    const imageFile = req.file;
    if (!userId) {
      res.status(401).json({ status: "failed", data: "Unauthorized" });
      return;
    }
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["addresses"],
    });
    if (!user) {
      res.status(404).json({ status: "failed", data: "User not found" });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await argon2.hash(password);

    let imageUrl = user.imageUrl;
    if (imageFile) {
      if (user.imageUrl) {
        const publicId = getPublicIdFromUrl(user.imageUrl);
        await deleteImage(publicId);
      }
      const base64Image = `data:${
        imageFile.mimetype
      };base64,${imageFile.buffer.toString("base64")}`;
      imageUrl = await uploadImage(base64Image);
      user.imageUrl = imageUrl;
    }
    let address =
      user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
    if (street || city || state || pincode || country) {
      if (!address) {
        address = new Address();
        address.user = user;
        address.isDefault = true;
      }
      if (!firstName && !address.firstName) {
        const nameParts = (name || user.name || "").trim().split(" ");
        address.firstName = nameParts[0] || "Unknown";
        address.lastName = nameParts.slice(1).join(" ") || "User";
      } else if (firstName) {
        address.firstName = firstName;
        address.lastName = lastName || "User";
      }
      if (street) address.streetAddress = street;
      if (city) address.city = city;
      if (state) address.state = state;
      if (pincode) address.pincode = pincode;
      if (country) address.country = country;
      await addressRepo.save(address);
    }
    await userRepo.save(user);

    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    };

    const token = generateToken(updatedUser);

    res.status(200).json({
      status: "success",
      data: "Profile updated successfully",
      token,
      user: updatedUser,
    });
  } catch (error) {
    console.error("In auth.ts", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({ status: "failed", data: errorMessage });
  }
};
