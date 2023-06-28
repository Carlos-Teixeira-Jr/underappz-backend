import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'
import { LoggerModule } from './logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule'

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
  providers: [AppService],
})
export class AppModule {}
