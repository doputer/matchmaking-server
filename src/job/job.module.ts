import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { JobService } from './job.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
