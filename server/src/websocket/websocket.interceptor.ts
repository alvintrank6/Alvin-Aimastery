import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class WebsocketInterceptor implements NestInterceptor {
  constructor(private readonly gateway: WebsocketGateway) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        // Only broadcast on write operations (POST, PUT, DELETE)
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          let event = '';

          if (url.includes('/leads')) {
            event = 'leads-updated';
          } else if (url.includes('/developers')) {
            event = 'developers-updated';
          } else if (url.includes('/projects')) {
            event = 'projects-updated';
          } else if (url.includes('/payouts')) {
            event = 'payouts-updated';
          } else if (url.includes('/analytics/track')) {
            event = 'traffic-updated';
          } else if (url.includes('/analytics/alerts')) {
            event = 'alerts-updated';
          } else if (url.includes('/settings')) {
            event = 'settings-updated';
          }

          if (event) {
            console.log(`Broadcasting WebSocket event: ${event}`);
            this.gateway.broadcast(event);
          }
        }
      }),
    );
  }
}
