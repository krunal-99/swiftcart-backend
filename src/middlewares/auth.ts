import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../utils/types";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        imageUrl: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ status: "failed", data: "No token provided." });
      return;
    }
    if (!process.env.SECRET) {
      throw new Error("SECRET environment variable is not defined");
    }
    const decoded = jwt.verify(token, process.env.SECRET) as JWTPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      imageUrl: decoded.imageUrl,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ status: "failed", data: "Token expired" });
      return;
    }
    res.status(401).json({
      status: "failed",
      data: "Invalid token",
      message: "Authorization failed. Please login again to continue.",
    });
    return;
  }
};

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!process.env.SECRET) {
      throw new Error("SECRET environment variable is not defined");
    }
    const decoded = jwt.verify(token!, process.env.SECRET)! as JWTPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      imageUrl: decoded.imageUrl,
    };
    next();
  } catch (error) {
    next();
  }
};
