import { BadRequestException, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { sendEmailVerificationCode } from 'src/common/utils/emailHandlers/emailVerification';
import { generateRandomString } from 'src/common/utils/generateRandomString';
import { RegisterDto } from '../users/dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, UserModelName } from '../users/schema/User.schema';
import { Model, Schema } from 'mongoose';
import { InjectorLoggerService } from '../logger/InjectorLoggerService';
import * as bcrypt from 'bcrypt';
import { ReSendVerifyEmailDto } from './dto/re-send-email-verification.dto';
import { LocalLoginDto } from './dto/local-login.dto';
import { JwtService } from '@nestjs/jwt';
import { VerifyEmailDto } from './dto/verify-email.dto';

export interface IVerifyEmail {
  emailVerificationCode: string
  emailVerificationExpiry: Date
}

export interface IUserPartialData {
  username: string
  email: string
  picture: string
}

export interface IUserReturn extends IUserPartialData {
  _id: Schema.Types.ObjectId
  isEmailVerified?: boolean
}

export interface IRefreshToken extends IUserReturn {
  access_token: string
  refresh_token: string
}

export interface ILoginOutput extends IUserReturn, IRefreshToken {
  picture: string
}

export interface IVerifyEmail {
  emailVerificationCode: string
  emailVerificationExpiry: Date
}

@Injectable()
export class AuthService {
  constructor(
    @InjectorLoggerService(UserService.name)
    private readonly logger: LoggerService,
    @InjectModel(UserModelName)
    private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

    // Login local (username e senha);
    async localLogin(localLoginDto: LocalLoginDto): Promise<ILoginOutput> {
      try {
        this.logger.log({}, 'start local login')
  
        const { email, password } = localLoginDto
  
        const existingUser = await this.userModel.findOne({
          email: email,
          isActive: true,
        })
  
        if (!existingUser) {
          throw new NotFoundException(
            `O usuário com o email: ${email} não foi encontrado`,
          )
        }
  
        const passwordMatched = await bcrypt.compare(
          password,
          existingUser.password,
        )
  
        if (!passwordMatched || existingUser.email !== email) {
          throw new BadRequestException(
            `O usuário ou a senha informados estão incorretos`,
          )
        }
  
        const payload = {
          sub: existingUser._id,
          email: email,
        }
  
        const access_token = this.jwtService.sign(payload, {
          expiresIn: process.env.TOKEN_EXPIRY,
        })
  
        const refresh_token = this.jwtService.sign(payload, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        })
  
        return {
          access_token,
          refresh_token,
          _id: existingUser._id,
          username: existingUser.username,
          picture: existingUser.picture,
          email: existingUser.email,
          isEmailVerified: existingUser.isEmailVerified,
        }
      } catch (error) {
        this.logger.error(error, 'exception')
        throw error
      }
    }

  // Cadastro de usuário
  async register(registerDto: RegisterDto): Promise<any> {
    try {
      this.logger.log({}, 'start register > [service]');

      const { email, password, confirmPassword } = registerDto;

      if (password !== confirmPassword) {
        throw new BadRequestException(
          `A confirmação de senha não corresponde à senha inserida.`,
        );
      }

      const existingUser = await this.userModel.findOne({
        email,
        isActive: true,
      });

      if (existingUser) {
        throw new BadRequestException(
          `O email: ${email} já está vinculado a uma conta cadastrada.`,
        );
      }

      const emailVerificationCode = generateRandomString();
      const emailVerificationExpiry = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      );

      const encryptedPassword = await bcrypt.hash(password, 10);
      const createdUser = await this.userModel.create({
        email: email,
        password: encryptedPassword,
        emailVerificationCode,
        emailVerificationExpiry,
      });

      await sendEmailVerificationCode(email, emailVerificationCode);

      return {
        _id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        isEmailVerified: createdUser.isEmailVerified,
        emailVerificationCode: createdUser.emailVerificationCode,
        emailVerificationExpiry: createdUser.emailVerificationExpiry,
      };
    } catch (error) {
      this.logger.error(error, 'exception');
      throw error;
    }
  }

  async reSendVerifyEmail(
    reSendVerifyEmailDto: ReSendVerifyEmailDto,
  ): Promise<IVerifyEmail> {
    try {
      this.logger.log({}, 'start re-send-verify-email')

      const { email } = reSendVerifyEmailDto

      const newEmailVerificationCode = generateRandomString()

      const newExpiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const updateUser = await this.userModel.updateOne(
        { email: email },
        {
          $set: {
            emailVerificationCode: newEmailVerificationCode,
            emailVerificationExpiry: newExpiryDate,
          },
        },
      )

      if (updateUser.modifiedCount === 0) {
        throw new NotFoundException(
          `Usuário com o email ${email} não encontrado`,
        )
      }

      // Consultar o usuário após a atualização
      const updatedUser = await this.userModel.findOne({
        email: email,
        isActive: true,
      })

      if (!updatedUser) {
        throw new NotFoundException(
          `Usuário com o email ${email} não encontrado`,
        )
      }

      await sendEmailVerificationCode(email, newEmailVerificationCode)

      return {
        emailVerificationCode: updatedUser.emailVerificationCode,
        emailVerificationExpiry: updatedUser.emailVerificationExpiry,
      }
    } catch (error) {
      this.logger.error(error, 'exception')
      throw error
    }
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    try {
      this.logger.log({}, 'start verify email')

      const { email, emailVerificationCode } = verifyEmailDto

      const user = await this.userModel.findOne({
        email: email,
        isActive: true,
      })

      if (user.emailVerificationExpiry < new Date()) {
        throw new NotFoundException(`Código de verificação expirado.`)
      }

      if (user.emailVerificationCode !== emailVerificationCode) {
        throw new BadRequestException(`Código de verificação inválido.`)
      }

      // Marcar o usuário como verificado
      user.isEmailVerified = true
      user.emailVerificationCode = null
      user.emailVerificationExpiry = null
      await user.save()

      return { message: 'E-mail verificado com sucesso!' }
    } catch (error) {
      this.logger.error(error, 'exception')
      throw error
    }
  }
}
