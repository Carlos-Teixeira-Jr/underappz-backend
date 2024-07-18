import {
  BadRequestException,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectorLoggerService } from '../logger/InjectorLoggerService';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, UserModelName } from './schema/User.schema';
import { Model } from 'mongoose';
import { generateRandomString } from 'src/common/utils/generateRandomString';
import * as bcrypt from 'bcrypt';
import { sendEmailVerificationCode } from 'src/common/utils/emailHandlers/emailVerification';
import { LocalLoginDto } from './dto/local-login.dto';
import { JwtService } from '@nestjs/jwt';
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectorLoggerService(UserService.name)
    private readonly logger: LoggerService,
    @InjectModel(UserModelName)
    private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  // Login local (username e senha);
  async localLogin(localLoginDto: LocalLoginDto): Promise<any> {
    try {
      this.logger.log({}, 'start local login > [service]');

      const { email, password } = localLoginDto;

      const existingUser = await this.userModel.findOne({
        email: email,
        isActive: true,
      });

      if (!existingUser) {
        throw new NotFoundException(
          `O usuário com o email: ${email} não foi encontrado`,
        );
      }

      const passwordMatched = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!passwordMatched || existingUser.email !== email) {
        throw new BadRequestException(
          `O usuário ou a senha informados estão incorretos`,
        );
      }

      const payload = {
        sub: existingUser._id,
        email: email,
      };

      const access_token = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_EXPIRY,
      });

      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      });

      return {
        access_token,
        refresh_token,
        _id: existingUser._id,
        username: existingUser.username,
        picture: existingUser.picture,
        email: existingUser.email,
        isEmailVerified: existingUser.isEmailVerified,
      };
    } catch (error) {
      this.logger.error(error, 'exception');
      throw error;
    }
  }

  async findOneByEmail(body: GetUserByEmailDto): Promise<IUser> {
    try {
      this.logger.log({ body }, 'findOneByEmail > [service]')

      const { email } = body

      const user = await this.userModel.findOne({ email: email })

      if (!user || !user.isActive) {
        throw new NotFoundException(
          `Usuário com o email: ${email} não foi encontrado`,
        )
      }

      return user
    } catch (error) {
      this.logger.error({
        error: JSON.stringify(error),
        exception: '> exception',
      })
      throw error
    }
  }
}
