import 'winston-daily-rotate-file';

import * as moment from 'moment';
import * as winston from 'winston';

import { ValidationPipeOptions } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { MongooseModuleOptions } from '@nestjs/mongoose';

import { ISwaggerConfig } from './swagger/interface';

export class ConfigService {
  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  public getBoolean(key: string): boolean {
    return JSON.parse(this.get(key));
  }

  get env(): string {
    return this.get('NODE_ENV');
  }

  get mongooseConfig(): MongooseModuleOptions {
    return {
      uri: this.get('DB_URI'),
    };
  }

  get swaggerConfig(): ISwaggerConfig {
    return {
      path: this.get('SWAGGER_PATH') || '/api',
      title: this.get('SWAGGER_TITLE') || '',
      description: this.get('SWAGGER_DESCRIPTION'),
      version: this.get('SWAGGER_VERSION') || '',
    };
  }

  get validationConfig(): ValidationPipeOptions {
    return {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    };
  }

  get winstonConfig(): winston.LoggerOptions {
    const { colorize, combine, printf } = winston.format;
    const { Console } = winston.transports;

    const logLevels: winston.config.AbstractConfigSetLevels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 5,
    };

    const logColors: winston.config.AbstractConfigSetColors = {
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      http: 'green',
      debug: 'blue',
    };

    winston.addColors(logColors);

    const loggingFormat = printf(({ level, message }) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
      }
      return `${moment().format('YYYY-MM-DD HH:mm:ss')} ${level} : ${message}`;
    });

    return {
      levels: logLevels,
      transports: [
        new winston.transports.DailyRotateFile({
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          dirname: 'log',
          level: 'http',
          format: combine(loggingFormat),
        }),
        new Console({
          level: 'debug',
          handleExceptions: true,
          format: combine(colorize(), loggingFormat),
        }),
      ],
      exitOnError: false,
    };
  }

  get corsConfig(): CorsOptions {
    const whitelist = this.get('CORS_WHITELIST');

    return {
      origin: (origin, callback) => {
        if (
          !origin ||
          whitelist.indexOf(origin) !== -1 ||
          origin === `http://localhost:${this.get('PORT')}`
        )
          callback(null, true);
        else callback(new Error('Not allowed by CORS'));
      },
      allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Content-Type',
        'Accept',
        'Authorization',
      ],
      methods: ['GET', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    };
  }
}
