import { Body, Controller, Logger, Post } from "@nestjs/common";
import { AuthService, IVerifyEmail } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "../users/dto/register.dto";
import { ReSendVerifyEmailDto } from "./dto/re-send-email-verification.dto";

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

  @Post('re-send-email-verify')
  @ApiOperation({
    summary:
      'Re-send the email verification code to the email used on register.',
  })
  async reSendVerifyEmail(
    @Body() reSendVerifyEmailDto: ReSendVerifyEmailDto,
  ): Promise<IVerifyEmail> {
    return await this.authService.reSendVerifyEmail(reSendVerifyEmailDto)
  }

}