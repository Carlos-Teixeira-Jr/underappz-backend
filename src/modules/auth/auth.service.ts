import { BadRequestException, Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { sendEmailVerificationCode } from 'src/common/utils/emailHandlers/emailVerification';
import { generateRandomString } from 'src/common/utils/generateRandomString';
import { RegisterDto } from '../users/dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, UserModelName } from '../users/schema/User.schema';
import { Model } from 'mongoose';
import { InjectorLoggerService } from '../logger/InjectorLoggerService';
import * as bcrypt from 'bcrypt';
import { ReSendVerifyEmailDto } from './dto/re-send-email-verification.dto';

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
  ) {}

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
}
