import { IsNotEmpty, IsString, IsEmail } from "class-validator"

export class LocalLoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}