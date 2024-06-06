import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModelName, UserSchema } from "./schema/User.schema";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../auth/constants";
import { UserController } from "./users.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule {}