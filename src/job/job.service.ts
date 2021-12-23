import Redis from 'ioredis';
import { LoggerService } from 'src/common/logger/logger.service';

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class JobService {
  private readonly pool;
  private readonly match;

  constructor(private readonly loggerService: LoggerService) {
    this.pool = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
    });

    this.match = new Redis({
      host: 'localhost',
      port: 6379,
      db: 1,
    });
  }

  @Cron('*/5 * * * * *')
  async findMatch(): Promise<void> {
    const keys = await this.pool.keys('*');
    // const values = await this.redis.mget(keys);
    if (keys.length < 2) return;

    const player1 = keys[0];
    const player2 = keys[1];

    console.log(player1);
    console.log(player2);

    await this.pool.del(player1);
    await this.pool.del(player2);

    await this.publishMatch(player1, player2);

    return;
  }

  async publishMatch(player1: string, player2: string): Promise<void> {
    const match = {
      player1,
      player2,
    };

    await this.match.publish('match', JSON.stringify(match));

    return;
  }
}
