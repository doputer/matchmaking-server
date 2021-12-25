import Redis from 'ioredis';
import { LoggerService } from 'src/common/logger/logger.service';
import { ConfigService } from 'src/config/config.service';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class JobService {
  private readonly pool;
  private readonly match;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
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

    await this.pool.del(player1);
    await this.pool.del(player2);

    await this.publishMatch(player1, player2);

    return;
  }

  async publishMatch(player1: string, player2: string): Promise<void> {
    const url = `${this.configService.get('API_SERVER')}/matches`;
    const body = {
      player1,
      player2,
    };

    const data: any = await lastValueFrom(
      this.httpService.post(url, body).pipe(map(response => response.data)),
    );

    const match = {
      matchId: data._id,
      player1,
      player2,
    };

    await this.match.publish('match', JSON.stringify(match));

    return;
  }

  async finishMatch(matchId: string, winner: string, loser: string) {
    const url = `${this.configService.get('API_SERVER')}/matches/${matchId}`;
    const body = {
      winner,
      loser,
    };

    await lastValueFrom(
      this.httpService.patch(url, body).pipe(map(response => response.data)),
    );

    return;
  }
}
