import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InjectorLoggerService } from "../logger/InjectorLoggerService";
import { LoggerService } from "../logger/logger.service";
import { UsersService } from "./users.service";

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(
    @InjectorLoggerService(UsersController.name)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService
  ){}

  // @Get(':_id')
  // async findUserById(@Param() params: GetUserDto) {
  //   return this.usersService.findOne(params._id)
  // }
}