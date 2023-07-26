import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectorLoggerService } from "../logger/InjectorLoggerService";
import { LoggerService } from "../logger/logger.service";
import { InjectModel } from "@nestjs/mongoose";
import { IUser, UserModelName } from "./schema/User.schema";
import { Model } from "mongoose";

@Injectable()
export class UsersService {
  constructor(
    @InjectorLoggerService(UsersService.name)
    private readonly logger: LoggerService,
    @InjectModel(UserModelName)
    private readonly userModel: Model<IUser>
  ){}

  async findOne(_id: string): Promise<any> {
    try {
      this.logger.log({ _id }, 'findOne')

      const user = await this.userModel.findById(_id)

      if (!user) {
        throw new NotFoundException(`Usuário com o id: ${_id} não encontrado.`)
      }

      return {
        _id: user._id,
        email: user.email,
      }
    } catch (error) {
      this.logger.error({
        error: JSON.stringify(error),
        exception: '> exception',
      })
      throw error
    }
  }
}