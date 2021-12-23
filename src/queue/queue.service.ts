import Redis from 'ioredis';
import { LoggerService } from 'src/common/logger/logger.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {
  constructor(private readonly logger: LoggerService) {}

  async addPlayer(player: { id: string; mmr: number }) {
    const pool = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
    });

    await pool.set(player.id, player.mmr);

    return;
  }

  getMessage(client) {
    return new Promise(function (resolve) {
      client.on('message', function (channel, message) {
        resolve(message);
      });
    });
  }

  async subscribeMatch(player: { id: string; mmr: number }) {
    const match = new Redis({
      host: 'localhost',
      port: 6379,
      db: 1,
    });

    await match.subscribe('match');

    while (true) {
      const message: any = await this.getMessage(match);
      const { player1, player2 } = JSON.parse(message);

      if (player1 === player.id || player2 === player.id) {
        await match.unsubscribe('match');

        return message;
      }
    }
  }

  async findMatch(player: { id: string; mmr: number }) {
    await this.addPlayer(player);

    const message = await this.subscribeMatch(player);

    return JSON.parse(message);
  }
}
