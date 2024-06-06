import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { IUser } from "./schema/User.schema";


@ApiTags('user')
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({
    summary:
      'Creates an account using email, password and password confirmation and returns user data.',
  })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.userService.register(registerDto)
  }
}