import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./session.serialize";


@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer]
})

export class AuthModule {}