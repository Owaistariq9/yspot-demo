import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
  } from '@nestjs/common';

  import { Request, Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      console.log('exception', exception);
      
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      if(!response.status){
        return new InternalServerErrorException();
      }
      response.status(status).json({
        statusCode: status,
        message: exception.response.message || exception.message || "Internal Server Error",
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }