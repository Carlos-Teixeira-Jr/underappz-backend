import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModelName, UserSchema } from "../users/schema/User.schema";
import { jwtConstants } from "./constants";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema,
      }
    ]),
    UsersModule, 
    PassportModule.register({ 
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' } 
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
  ]
})

export class AuthModule {}