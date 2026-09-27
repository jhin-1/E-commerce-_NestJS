import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 1. تحديد الـ Interface للـ Response الموحد
export interface Response<T> {
    message: string;
    status: number;
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        // جلب الـ HTTP Response لمعرفة الـ Status Code المرجّع (200, 201, etc.)
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        return next.handle().pipe(
            map((data) => ({
                message: 'success',
                status: statusCode,
                data: data ?? null, // لو السيرفس مش بترجع بيانات بترجع null بدل undefined
            })),
        );
    }
}