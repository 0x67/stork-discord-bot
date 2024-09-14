import { Params } from 'nestjs-pino';
import { multistream } from 'pino';
import PinoPretty from 'pino-pretty';

export const loggerConfig: Params = {
  pinoHttp: [
    {
      timestamp: () => `,"timestamp":"${new Date().toUTCString()}"`,
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              colorize: process.env.NODE_ENV !== 'production',
              levelFirst: true,
              ignore: 'pid,res',
              translateTime: process.env.NODE_ENV !== 'production',
            },
            level: process.env.LOG_LEVEL || 'info',
          },
        ],
      },
      customLogLevel: function (req, res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return 'info';
        } else if (res.statusCode >= 500 || err) {
          return 'error';
        } else if (res.statusCode >= 300 && res.statusCode < 400) {
          return 'silent';
        }
        return 'info';
      },
    },
    multistream([
      {
        stream:
          process.env.NODE_ENV === 'production' ? process.stdout : PinoPretty(),
      },
    ]),
  ],
};
