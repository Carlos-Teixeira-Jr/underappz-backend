import { Body, Controller, Get, Logger, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PartialUserData, UserService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { IUser } from "./schema/User.schema";
import { GetUserByEmailDto } from "./dto/get-user-by-email.dto";
import { GetUserDto } from "./dto/get-user.deto";


@ApiTags('user')
@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService
  ) {}

  @ApiOperation({
    summary: 'Find and return an user by his id.',
  })
  @Get(':_id')
  async findUserById(@Param() params: GetUserDto): Promise<PartialUserData> {
    this.logger.log({ params }, 'start find user by id > [controller]')

    return this.userService.findOne(params._id)
  }

  @ApiOperation({
    summary: 'Find and return an user by his email.',
  })
  @Post('find-by-email')
  async findByEmail(@Body() body: GetUserByEmailDto): Promise<IUser> {
    this.logger.log({ body }, 'start find user by email > [user controller]')

    return this.userService.findOneByEmail(body)
  }
}