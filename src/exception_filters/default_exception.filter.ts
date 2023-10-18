import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception) {
      return response.status(status).json(exception.getResponse());
    }

    return response.status(500).json({
      statusCode: 500,
      type: 'internal_server_error',
      message: 'A intervenit o eroare pe server.',
      solution: 'Vă rugăm să încercați din nou mai târziu.',
    });
  }
}
