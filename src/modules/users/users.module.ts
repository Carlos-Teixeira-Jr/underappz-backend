import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";

export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
}

@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}