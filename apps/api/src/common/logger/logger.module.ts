import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'cron.log',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

          if (stack) {
            logMessage += `\n${stack}`;
          }

          return logMessage;
        })
      ),
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
