import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TimeLogsService } from './timeLogs.service';
import {
  BulkSaveTimeLogDto,
  CreateTimeLogDto,
  DateRangeQueryDto,
  ManagerDashboardQueryDto,
  ProjectDateRangeQueryDto,
  UpdateTimeLogDto,
} from './dto/timeLogs.controller.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser, Role } from 'src/auth/types/oauth.types';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('/time-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  @Post()
  createLog(@Req() req: RequestWithUser, @Body() createTimeLogDto: CreateTimeLogDto) {
    return this.timeLogsService.createLog(req.user, createTimeLogDto);
  }

  @Post('bulk/:projectId')
  createBulk(
    @Req() req: RequestWithUser,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ParseArrayPipe({ items: BulkSaveTimeLogDto })) createDtos: BulkSaveTimeLogDto[]
  ) {
    return this.timeLogsService.createBulk(req.user, projectId, createDtos);
  }

  @Get('me')
  findMyLogs(@Req() req: RequestWithUser, @Query() query: ProjectDateRangeQueryDto) {
    return this.timeLogsService.findLogsByPeriod(req.user, query.from, query.to, query.projectId);
  }

  @Get('missing-report/:userId')
  @Roles(Role.MANAGER, Role.ADMIN)
  getMissingDays(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: DateRangeQueryDto
  ) {
    return this.timeLogsService.findMissingDays(userId, query.from, query.to);
  }

  @Get('manager-report')
  @Roles(Role.MANAGER, Role.ADMIN)
  getManagerReport(@Query() query: ManagerDashboardQueryDto) {
    return this.timeLogsService.getManagerDashboard(query.from, query.to, query.search);
  }
  @Patch(':id')
  updateLog(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTimeLogDto: UpdateTimeLogDto
  ) {
    return this.timeLogsService.updateLog(req.user, id, updateTimeLogDto);
  }

  @Delete(':id')
  deleteLog(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.timeLogsService.deleteLog(req.user, id);
  }
}
