import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    // 1. التعامل مع الأخطاء المعروفة (HttpException) مثل BadRequestException أو UnauthorizedException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // في حالة وجود رسائل جلب الأخطاء من class-validator
        const res = exceptionResponse as Record<string, any>;
        message = res.message || exception.message;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // 2. التعامل مع أخطاء الـ System أو الـ Database غير المتوقعة
      message = exception.message;
    }

    // 3. توحيد شكل الاستجابة للخطأ
    response.status(status).json({
      message,
      status,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
