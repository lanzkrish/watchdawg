/** @format */

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

// import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';
import { OrganizationModule } from './organization/organization.module';
import { UsersModule } from './users/users.module';

import { AdminDashboardModule } from './admin/dashboard/dashboard.module';
import { EmployeesModule } from './admin/employees/employees.module';
import { LiveController } from './admin/live/live.controller';
import { LiveModule } from './admin/live/live.module';
import { LiveService } from './admin/live/live.service';
import { AdminReportsController } from './admin/reports/reports.controller';
import { AdminReportsModule } from './admin/reports/reports.module';
import { AdminReportsService } from './admin/reports/reports.service';
import { AdminSettingsController } from './admin/settings/settings.controller';
import { AdminSettingsModule } from './admin/settings/settings.module';
import { AdminSettingsService } from './admin/settings/settings.service';
import { AgentAuthModule } from './auth/agent-auth.module';
import { CategorizationService } from './categorization/categorization.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { EmailModule } from './email/email.module';
import { EmployeeActivityModule } from './employee/activity/activity.module';
import { EmployeeDashboardModule } from './employee/dashboard/dashboard.module';
import { EmployeeReportsModule } from './employee/reports/reports.module';
import { GatewayModule } from './gateway/gateway.module';
import { HealthModule } from './health/health.module';
import { ReportsService } from './reports/reports.service';
import { ScreenshotsController } from './screenshots/screenshots.controller';
import { ScreenshotsService } from './screenshots/screenshots.service';
import { SuperAdminDashboardModule } from './super-admin/dashboard/dashboard.module';
import { OrganizationsModule } from './super-admin/organizations/organizations.module';
import { RevenueModule } from './super-admin/revenue/revenue.module';
import { SettingsModule } from './super-admin/settings/settings.module';
import { SystemController } from './super-admin/system/system.controller';
import { SystemModule } from './super-admin/system/system.module';
import { SystemService } from './super-admin/system/system.service';
import { TasksModule } from './tasks/tasks.module';
import { TrackingController } from './tracking/tracking.controller';
import { TrackingService } from './tracking/tracking.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),

    ScheduleModule.forRoot(),

    DatabaseModule,
    AuthModule,
    AgentAuthModule,
    UsersModule,
    OrganizationModule,
    DashboardModule,
    // ActivityModule,
    SuperAdminDashboardModule,
    OrganizationsModule,
    RevenueModule,
    SettingsModule,
    SystemModule,
    AdminDashboardModule,
    EmployeeDashboardModule,
    LiveModule,
    AdminReportsModule,
    EmployeesModule,
    AdminSettingsModule,
    EmployeeActivityModule,
    EmployeeReportsModule,
    HealthModule,
    GatewayModule,
    TasksModule,
    EmailModule,
  ],

  /* 🔥 ADD HERE */
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    SystemService,
    LiveService,
    ReportsService,
    AdminSettingsService,
    TrackingService,
    ScreenshotsService,
    CategorizationService,
    AdminReportsService,
  ],

  controllers: [
    SystemController,
    LiveController,
    AdminReportsController,
    AdminSettingsController,
    TrackingController,
    ScreenshotsController,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
