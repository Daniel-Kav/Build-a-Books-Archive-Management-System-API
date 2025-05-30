import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // Catch all exceptions if no specific one is provided
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message // Handle class-validator messages
        : 'Internal server error';

    // Add logging here for production
    console.error(
        `HTTP Status: ${status} Error Message: ${JSON.stringify(message)} Path: ${request.url}`,
        exception instanceof HttpException ? exception.stack : exception,
      );


    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception instanceof HttpException ? exception.name : 'Error',
      message: Array.isArray(message) ? message : [message], // Ensure message is an array for consistency
    });
  }
} 