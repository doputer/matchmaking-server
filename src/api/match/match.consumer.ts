import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('match')
export class MatchConsumer {
  @Process('transcode')
  handleTranscode(job: Job) {
    console.log('Start transcoding...');
    console.log(job.data);
    console.log('Transcoding completed');
  }
}
