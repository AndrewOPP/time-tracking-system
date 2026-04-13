import { Controller, Get, UseGuards } from '@nestjs/common';
import { ManagerDashboardService } from './manager-dashboard.service';
import { ManagerDashboardOverviewResponse } from './dto/manager-dashboard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('manager-dashboard')
export class ManagerDashboardController {
  constructor(private readonly managerDashboardService: ManagerDashboardService) {}

  @Get('overview')
  async getOverview(): Promise<ManagerDashboardOverviewResponse> {
    return this.managerDashboardService.getOverviewData();
  }
}
