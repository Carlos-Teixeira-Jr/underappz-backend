import { 
  BadRequestException, 
  CallHandler, 
  ExecutionContext, 
  ForbiddenException, 
  HttpException, 
  Injectable, 
  InternalServerErrorException, 
  NestInterceptor, 
  NotFoundException, 
  UnauthorizedException 
} from "@nestjs/common";
import { Observable, catchError } from "rxjs";
import { InjectorLoggerService } from "src/logger/InjectorLoggerService";
import { LoggerService } from "src/logger/logger.service";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(
    @InjectorLoggerService(ErrorsInterceptor.name)
    private readonly logger: LoggerService,
  ){}

  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: HttpException) => {
        this.logger.error(
          { error: JSON.stringify(error) },
          `interceptor > exception > internal server`,
        )

        if (error instanceof UnauthorizedException) {
          throw new ForbiddenException()
        }

        if (error instanceof BadRequestException) {
          throw new BadRequestException(this.getMessage(error))
        }

        if (error instanceof NotFoundException) {
          throw new NotFoundException(this.getMessage(error))
        }

        throw new InternalServerErrorException(
          process.env.NODE_ENV !== 'prd'
            ? error.message
            : 'Internal server error',
        )
      }),
    )
  }

  getMessage(error: HttpException): any {
    const response = error.getResponse()
    const message = response?.['message']

    if (!message) {
      return error.message
    }

    if (Array.isArray(message)) {
      return message.join('; ')
    }

    return message
  }
}