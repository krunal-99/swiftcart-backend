import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  validate,
} from "class-validator";
import { NextFunction, Request, Response } from "express";

class RegisterUser {
  @IsString()
  @MinLength(2, { message: "Name must be at least 2 characters long." })
  name: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

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

  constructor(name: string, email: string, password: string, imageUrl: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.imageUrl = imageUrl;
  }
}

export const signUpValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, imageUrl } = req.body;
  const userInput = new RegisterUser(name, email, password, imageUrl);
  const errors = await validate(userInput);

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
