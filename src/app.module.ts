import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { JobModule } from './job/job.module';
import { MatchModule } from './match/match.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.mongooseConfig,
    }),
    QueueModule,
    MatchModule,
    JobModule,
  ],
})
export class AppModule {}
