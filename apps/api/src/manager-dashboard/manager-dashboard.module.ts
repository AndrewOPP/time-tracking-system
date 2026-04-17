import { Module } from '@nestjs/common';
import { ManagerDashboardController } from './manager-dashboard.controller';
import { ManagerDashboardService } from './manager-dashboard.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ManagerDashboardController],
  providers: [ManagerDashboardService],
})
export class ManagerDashboardModule {}
