import { JobModule } from 'src/job/job.module';

import { Module } from '@nestjs/common';

import { MatchGateway } from './match.gateway';

@Module({
  imports: [JobModule],
  providers: [MatchGateway],
})
export class MatchModule {}
