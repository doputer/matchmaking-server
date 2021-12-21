import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { QueueConsumer } from './queue.consumer';
import { QueueGateway } from './queue.gateway';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [QueueService, QueueConsumer, QueueGateway],
})
export class QueueModule {}
