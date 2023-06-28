import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { LoggerModule } from './logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule'
import { LoggerService } from './logger/logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './common/interceptors/errors.interceptors';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_HOST}`, {
      dbName: process.env.DB_NAME,
      autoIndex: false,
      autoCreate: false,
    }),
    MongooseModule.forFeature([]),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    }
  ],
  exports: [AppService]
})
export class AppModule {}
