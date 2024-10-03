import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { LoggerModule } from './modules/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule'
import { LoggerService } from './modules/logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptors';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { UserModelName, UserSchema } from './modules/users/schema/User.schema';
import { AuthService } from './modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_HOST}`, {
      dbName: process.env.DB_NAME,
      autoIndex: false,
      autoCreate: false,
    }), 
    MongooseModule.forFeature([
      {
        name: UserModelName,
        schema: UserSchema
      }
    ]),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot(),
    AuthModule,
    UsersModule,
    PostModule
  ], 
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    JwtService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    }
  ],
  exports: [AppService]
})
export class AppModule {}
