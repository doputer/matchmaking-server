import { Queue } from 'bull';

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('queue') private matchQueue: Queue) {}

  async addJob() {
    const job = await this.matchQueue.add('transcode', {
      foo: 'bar',
    });

    return job.id;
  }
}
