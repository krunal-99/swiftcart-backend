import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { updateUserDTO } from "../utils/updateUserDTO";
import { validate, ValidationError } from "class-validator";

export const updateUserValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request body:", req.body, "File:", req.file);
    if (req.body.userId) {
      req.body.userId = parseInt(req.body.userId);
    } else {
      res.status(400).json({
        status: "failed",
        data: "userId is required",
      });
      return;
    }

    const dto = plainToInstance(updateUserDTO, req.body);

    const errors: ValidationError[] = await validate(dto, {
      skipMissingProperties: true,
      forbidUnknownValues: true,
    });

    const hasAtLeastOneField =
      dto.name ||
      dto.email ||
      dto.password ||
      dto.firstName ||
      dto.lastName ||
      dto.street ||
      dto.city ||
      dto.state ||
      dto.pincode ||
      dto.country ||
      req.file;

    if (!hasAtLeastOneField) {
      res.status(400).json({
        status: "failed",
        data: "At least one field must be provided for update",
      });
      return;
    }

    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}).join(", "))
        .join(", ");
      console.log("Validation errors:", errorMessages);
      res.status(400).json({
        status: "failed",
        data: errorMessages,
      });
      return;
    }

    if (dto.password && dto.password !== req.body.confirmPassword) {
      res.status(400).json({
        status: "failed",
        data: "Confirm password must match password",
      });
      return;
    }

    if (
      (dto.street || dto.city || dto.state || dto.pincode || dto.country) &&
      (!dto.firstName || !dto.lastName)
    ) {
      res.status(400).json({
        status: "failed",
        data: "First name and last name are required when updating address",
      });
      return;
    }

    req.body = dto;
    next();
  } catch (error) {
    console.error("Validation middleware error:", error);
    res.status(500).json({
      status: "failed",
      data: "Internal Server Error during validation",
    });
    return;
  }
};
