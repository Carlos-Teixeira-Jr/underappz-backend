import { Body, Controller, Logger, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "../users/dto/register.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary:
      'Creates an account using email, password and password confirmation and returns user data.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    this.logger.log({ registerDto }, 'start login > [auth controller]')

    return await this.authService.register(registerDto)
  }

}