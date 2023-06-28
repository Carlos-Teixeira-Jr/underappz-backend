import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectorLoggerService } from './logger/InjectorLoggerService';
import { LoggerService } from './logger/logger.service';
import { HealthCheckResponse } from './common/responses/heathCheck.response';

@Controller()
export class AppController {
  constructor(
    @InjectorLoggerService(AppController.name)
    private readonly logger: LoggerService,
    private readonly appService: AppService
  ) {}

  @Get()
  healthCheck(): HealthCheckResponse {
    this.logger.log({}, 'healthCheck')
    return {
      message: 'OK',
      uptime: process.uptime(),
      timestamp: new Date()
    }
  }
}
