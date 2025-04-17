import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsInt,
} from "class-validator";

export class updateUserDTO {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "Name must contain only letters and spaces",
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;

  @IsOptional()
  @IsString({ message: "password must be a string" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
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
  password?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
