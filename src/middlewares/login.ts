import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  validate,
} from "class-validator";
import { NextFunction, Request, Response } from "express";

class LoginUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export const loginValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const userDetails = new LoginUser(email, password);
  const errors = await validate(userDetails);

  if (errors.length > 0) {
    res.json({
      status: "failed",
      data: errors
        .map((err) => (err.constraints ? Object.values(err.constraints) : []))
        .flat(),
    });
    return;
  }
  next();
};
