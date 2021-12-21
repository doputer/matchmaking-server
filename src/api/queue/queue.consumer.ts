import { Job } from 'bull';

import { Process, Processor } from '@nestjs/bull';

@Processor('queue')
export class QueueConsumer {
  @Process('transcode')
  handleTranscode(job: Job) {
    console.log('Start transcoding...');
    console.log(job.data);
    console.log('Transcoding completed');
  }
}
