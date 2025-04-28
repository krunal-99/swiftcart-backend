import { Request, Response } from "express";
import { addressRepo, userRepo } from "../utils/services";

export const createAddress = async (req: Request, res: Response) => {
  const {
    userId,
    first_name,
    last_name,
    address,
    city,
    state,
    pincode,
    country,
    is_default,
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

    if (is_default) {
      const existingDefault = await addressRepo.findOne({
        where: { user: { id: userId }, is_default: true },
      });
      if (existingDefault) {
        await addressRepo.update(
          { id: existingDefault.id },
          { is_default: false }
        );
      }
    }
    const newAddress = addressRepo.create({
      first_name,
      last_name,
      street_address: address,
      city,
      state,
      pincode,
      country,
      is_default: is_default || false,
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
      order: { is_default: "DESC" },
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
