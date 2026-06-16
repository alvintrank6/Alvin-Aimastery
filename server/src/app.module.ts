import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { FreelancersModule } from './freelancers/freelancers.module';
import { ProjectsModule } from './projects/projects.module';
import { PayoutsModule } from './payouts/payouts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';
import { WebsocketModule } from './websocket/websocket.module';
import { WebsocketInterceptor } from './websocket/websocket.interceptor';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    LeadsModule,
    FreelancersModule,
    ProjectsModule,
    PayoutsModule,
    AnalyticsModule,
    SettingsModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: WebsocketInterceptor,
    },
  ],
})
export class AppModule {}
