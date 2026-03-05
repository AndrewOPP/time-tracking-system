import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class TimeLogsReminderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async sendWeeklyReminders() {
    const startTime = performance.now();
    let successCount = 0;

    const activeUsers = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, email: true, realName: true },
    });

    if (activeUsers.length === 0) {
      const duration = ((performance.now() - startTime) / 1000).toFixed(1);
      this.logger.info(
        `Weekly reminder job completed. No active users found. Duration: ${duration}s`
      );
      return;
    }

    await Promise.all(
      activeUsers.map(async user => {
        try {
          const message = `Don't forget to track your hours for this week! Visit your profile to see your time logs`;
          await this.sendNotificationStub(user.email, message);
          this.logger.info(
            `Reminder was sent to employee "${user.realName || user.email}" [id: ${user.id}]. Message: "${message}"`
          );
          successCount++;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));

          this.logger.error(
            `Failed to send reminder to ${user.email} [id: ${user.id}]. Reason: ${err.message}`,
            { stack: err.stack }
          );
        }
      })
    );

    const duration = ((performance.now() - startTime) / 1000).toFixed(1);
    this.logger.info(
      `Weekly reminder job completed. Total reminders sent: ${successCount}. Duration: ${duration}s`
    );
  }

  private async sendNotificationStub(email: string, message: string) {
    await new Promise(resolve => setTimeout(resolve, 50));
    return `Sent to ${email}: ${message}`;
  }
}
