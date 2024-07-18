import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation } from "@nestjs/swagger";
import { RegisterDto } from "../users/dto/register.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary:
      'Creates an account using email, password and password confirmation and returns user data.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.authService.register(registerDto)
  }

}