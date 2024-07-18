import { Body, Controller, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { IUser } from "./schema/User.schema";
import { GetUserByEmailDto } from "./dto/get-user-by-email.dto";


@ApiTags('user')
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService
  ) {}

  @ApiOperation({
    summary: 'Find and return an user by his email.',
  })
  @Post('find-by-email')
  async findByEmail(@Body() body: GetUserByEmailDto): Promise<IUser> {
    this.logger.log({ body }, 'start find user by email > [user controller]')

    return this.userService.findOneByEmail(body)
  }
}