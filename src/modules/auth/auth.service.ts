import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { InjectorLoggerService } from "../logger/InjectorLoggerService";
import { LoggerService } from "../logger/logger.service";
import { InjectModel } from "@nestjs/mongoose";
import { IUser, UserModelName } from "../users/schema/User.schema";
import { Model, Types } from "mongoose";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";

export type ILoginOutput = {
  access_token: string
  refresh_token: string
  _id: Types.ObjectId
  name: string
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    @InjectorLoggerService(AuthService.name)
    private readonly logger: LoggerService,
    @InjectModel(UserModelName)
    private readonly userModel: Model<IUser>,
    private readonly jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      this.logger.log({}, 'start register')

      const { email, name, username, password, passwordConfirmation } = registerDto;

      if (password !== passwordConfirmation) {
        throw new BadRequestException(
          `A confirmação de senha não corresponde à senha inserida.`,
        )
      }

      const existingUser = await this.userModel.findOne({ email: email })

      if (existingUser) {
        throw new BadRequestException(
          `O email: ${email} já está vinculado a uma conta cadastrada.`,
        )
      }

      const encryptedPassword = await bcrypt.hash(password, 10)
      const createdUser = await this.userModel.create({
        email: email,
        password: encryptedPassword,
        name: name,
        username: username
      })

      const payload = {
        sub: createdUser._id,
        email: email,
      }

      const access_token = this.jwtService.sign(payload, {
        expiresIn: '10d',
      })

      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: '20d',
      })

      //await sendWelcomeEmail(registerDto)

      return {
        access_token,
        refresh_token,
        _id: createdUser._id,
        name: createdUser.username,
        email: createdUser.email,
      }
    } catch (error) {
      this.logger.error(error, 'exception')
      throw error
    }
  }

  async login(loginDto: LoginDto): Promise<ILoginOutput> {
    try {
      this.logger.log({ }, 'start local login');

      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email: email })

      if (!user) {
        throw new NotFoundException(
          `O usuário com o email: ${email} não foi encontrado`,
        )
      }

      const passwordMatched = await bcrypt.compare(
        password,
        user.password,
      )

      if (!passwordMatched || user.email !== email) {
        throw new BadRequestException(
          `O usuário ou a senha informados estão incorretos`,
        )
      }

      const payload = {
        sub: user._id,
        email: email,
      }

      const access_token = this.jwtService.sign(payload, {
        expiresIn: '10d',
      })

      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: '20d',
      })

      return {
        access_token,
        refresh_token,
        _id: user._id,
        name: user.username,
        email: user.email,
      }
    } catch (error) {
      this.logger.error(error, 'exception')
      throw error
    }
  }

  async validateUser(username: string, password: string):Promise<any>{
    const user = await this.usersService.findOne(username);

    if (user && user.password === password){
      const { password, username, ...rest } = user;
      return rest;
    }

    return null;
  }
}
