import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { RollbarLogger } from 'nestjs-rollbar';

@Catch()
export class GlobalRollbarExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: RollbarLogger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Log exception with Rollbar
    this.logger.error(exception, request);

    // Customize the response as needed
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
