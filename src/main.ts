import * as morgan from 'morgan';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);

  // CORS
  app.enableCors(configService.corsConfig);

  // Logger
  app.useLogger(loggerService);
  app.use(
    morgan(
      'HTTP/:http-version :method :remote-addr :url :remote-user :status :res[content-length] :referrer :user-agent :response-time ms',
      {
        skip: req => req.url === '/favicon.ico' || req.url === '/',
        stream: {
          write: message => {
            loggerService.http(message);
          },
        },
      },
    ),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe(configService.validationConfig));

  const port = configService.get('PORT');
  const host = configService.get('HOST');

  await app.listen(port, host);

  loggerService.warn(`server is running on ${configService.env}`);
}
bootstrap();
