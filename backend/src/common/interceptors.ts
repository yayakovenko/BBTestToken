import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { method, url } = request;
        const userAgent = request.headers['user-agent'] || 'Unknown';

        this.logger.log(`➡️ ${method} ${url} - ${userAgent}`);

        const startTime = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const responseTime = Date.now() - startTime;
                this.logger.log(`⬅️ ${method} ${url} - ${response.statusCode} [${responseTime}ms]`);
            }),
        );
    }
}
