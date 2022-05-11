// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost
// } from '@nestjs/common';
// import { BaseRpcExceptionFilter } from '@nestjs/microservices';
// @Catch()
// export class AllExceptionsFilter extends BaseRpcExceptionFilter implements ExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     console.log("exception",exception);
//     const ctx = host.switchToRpc();
//     const data = ctx.getData();
//     const context = ctx.getContext();
//     return super.catch(exception, host);
//   }
// }

// import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
// import { RpcException } from '@nestjs/microservices';

// @Catch(RpcException)
// export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    
//     // return throwError(exception.getError());
//     console.log("here",exception)
//     return throwError(()=> exception.getError());
//   }
// }