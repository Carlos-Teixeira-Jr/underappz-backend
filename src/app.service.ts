import { Injectable } from '@nestjs/common';
import { InjectorLoggerService } from './modules/logger/InjectorLoggerService';
import { LoggerService } from './modules/logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    @InjectorLoggerService(AppService.name)
    private readonly logger: LoggerService
  ){}
}
