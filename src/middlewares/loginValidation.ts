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
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @Matches(/(?=.*[a-z])/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/(?=.*[A-Z])/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/(?=.*\d)/, { message: "Password must contain at least one number" })
  @Matches(/(?=.*[\W_])/, {
    message: "Password must contain at least one special character",
  })
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
