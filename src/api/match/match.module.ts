import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MatchConsumer } from './match.consumer';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'match',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchConsumer],
})
export class MatchModule {}
