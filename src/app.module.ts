import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QueueModule } from './api/queue/queue.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.mongooseConfig,
    }),
    QueueModule,
  ],
})
export class AppModule {}
