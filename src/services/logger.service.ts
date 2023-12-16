import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export class LoggerService {
  dailyRotateFileTransport: any = null;
  createLoggerConfig: winston.LoggerOptions = null;

  constructor() {
    this.dailyRotateFileTransport = new DailyRotateFile({
      filename: `logs/app_log-%DATE%.log`,
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '1d',
    });

    this.createLoggerConfig = {
      level: 'warn',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(
          ({
            level = 'info',
            message,
            requestId,
            timestamp,
            err,
            ...metadata
          }) => {
            // if (!req) {
            //   req = { headers: {} };
            // }

            const logObj = {
              timestamp,
              level,
              requestId,
              ...metadata,
              message,
              error: {},
            };

            if (err) {
              logObj.error = err.stack || err;
            }
            return JSON.stringify(logObj);
          },
        ),
      ),

      transports: [
        new winston.transports.Console({ level: 'info' }),
        this.dailyRotateFileTransport,
      ],
    };
  }
}
