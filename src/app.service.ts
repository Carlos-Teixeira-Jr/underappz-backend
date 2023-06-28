import { Injectable } from '@nestjs/common';
import { InjectorLoggerService } from './logger/InjectorLoggerService';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    @InjectorLoggerService(AppService.name)
    private readonly logger: LoggerService
  ){}
}
