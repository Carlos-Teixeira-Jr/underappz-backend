import { Body, Controller, Logger, Post } from "@nestjs/common";
import { AuthService, ILoginOutput, IVerifyEmail } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "../users/dto/register.dto";
import { ReSendVerifyEmailDto } from "./dto/re-send-email-verification.dto";
import { LocalLoginDto } from "./dto/local-login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name)

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary:
      'Realizes the login using email and password and return user data.',
  })
  async localLogin(
    @Body() localLoginDto: LocalLoginDto,
  ): Promise<ILoginOutput> {
    return await this.authService.localLogin(localLoginDto)
  }

  @Post('register')
  @ApiOperation({
    summary:
      'Creates an account using email, password and password confirmation and returns user data.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    this.logger.log({ registerDto }, 'start login > [auth controller]')

    return await this.authService.register(registerDto)
  }

  @Post('verify-email')
  @ApiOperation({
    summary:
      'Verify if the verification code that was send to the user email is valid.',
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    return await this.authService.verifyEmail(verifyEmailDto)
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