import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './api/auth/auth.module';
import { GameModule } from './api/game/game.module';
import { UserModule } from './api/user/user.module';
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
    AuthModule,
    UserModule,
    GameModule,
    QueueModule,
    MatchModule,
    JobModule,
  ],
})
export class AppModule {}
