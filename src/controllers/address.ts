import { Request, Response } from "express";
import { addressRepo, userRepo } from "../utils/services";

export const createAddress = async (req: Request, res: Response) => {
  const {
    userId,
    firstName,
    lastName,
    address,
    city,
    state,
    pincode,
    country,
    isDefault,
  } = req.body;

  try {
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["addresses"],
    });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (isDefault) {
      const existingDefault = await addressRepo.findOne({
        where: { user: { id: userId }, isDefault: true },
      });
      if (existingDefault) {
        await addressRepo.update(
          { id: existingDefault.id },
          { isDefault: false }
        );
      }
    }
    const newAddress = addressRepo.create({
      firstName,
      lastName,
      streetAddress: address,
      city,
      state,
      pincode,
      country,
      isDefault: isDefault || false,
      user,
    });
    await addressRepo.save(newAddress);
    res
      .status(201)
      .json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save address" });
  }
};

export const getUserAddresses = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const addresses = await addressRepo.find({
      where: { user: { id: parseInt(userId) } },
      order: { isDefault: "DESC" },
    });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};
