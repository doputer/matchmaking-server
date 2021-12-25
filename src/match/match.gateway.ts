import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/common/logger/logger.service';
import { JobService } from 'src/job/job.service';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'match',
  cors: true,
})
export class MatchGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private rooms = {};

  constructor(
    private readonly logger: LoggerService,
    private readonly jobService: JobService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('enter')
  async handleEnter(
    @ConnectedSocket() client: Socket,
    @MessageBody() player: { id: string; mmr: number; matchId },
  ): Promise<void> {
    await client.join(player.matchId);

    if (this.rooms[player.matchId]) this.rooms[player.matchId].push(player.id);
    else this.rooms[player.matchId] = [player.id];

    if (this.rooms[player.matchId].length === 2) {
      this.server.in(player.matchId).emit('message', '경기를 시작합니다.');
      this.server.in(player.matchId).emit('system', { start: true });
    }
  }

  @SubscribeMessage('win')
  async handleCorrect(
    @ConnectedSocket() client: Socket,
    @MessageBody() player: { id: string; mmr: number; matchId },
  ): Promise<void> {
    this.server.in(player.matchId).emit('message', '경기가 종료되었습니다.');
    this.server.in(player.matchId).emit('system', { start: false });
    this.server.in(player.matchId).emit('system', { exit: true });

    const room = this.rooms[player.matchId];
    console.log(room);
    const winner = room[0] === player.id ? room[0] : room[1];
    const loser = room[0] === player.id ? room[1] : room[0];

    /**
     * 플레이어를 소켓 룸에서 내보내는 로직
     */

    await this.jobService.finishMatch(player.matchId, winner, loser);

    return;
  }

  afterInit() {
    return;
  }

  handleConnection(client: Socket) {
    return;
  }

  handleDisconnect(client: Socket) {
    return;
  }
}
