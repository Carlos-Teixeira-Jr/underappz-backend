import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectorLoggerService } from './modules/logger/InjectorLoggerService';
import { LoggerService } from './modules/logger/logger.service';
import { HealthCheckResponse } from './common/responses/heathCheck.response';
import { LocalAuthGuard } from './modules/auth/guards/local-auth.guard';

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

  // Login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return {msg: 'Logged in!'};
  }

  @UseGuards()
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
}
