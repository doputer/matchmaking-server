import { Queue } from 'bull';

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchService {
  constructor(@InjectQueue('match') private audioQueue: Queue) {}

  async addJob() {
    const job = await this.audioQueue.add('transcode', {
      foo: 'bar',
    });

    return job.id;
  }
}
