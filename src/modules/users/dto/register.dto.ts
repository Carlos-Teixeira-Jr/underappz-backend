import { IsNotEmpty, IsString, IsEmail, Validate } from "class-validator"

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsString()
  @Validate((value, args) => value === args.object.password)
  confirmPassword: string
}