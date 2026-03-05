import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimeLogsReminderService } from './timeLogsReminder.service';

@Injectable()
export class TimeLogsCronService {
  private isRunning = false;

  constructor(private readonly reminderService: TimeLogsReminderService) {}

  @Cron('30 17 * * 5', { timeZone: 'Europe/Kyiv' })
  async weeklyReminders() {
    await this.runJob();
  }

  private async runJob() {
    if (this.isRunning) return;
    this.isRunning = true;
    try {
      await this.reminderService.sendWeeklyReminders();
    } finally {
      this.isRunning = false;
    }
  }
}
