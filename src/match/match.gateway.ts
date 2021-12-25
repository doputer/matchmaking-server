import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/common/logger/logger.service';

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

  constructor(private readonly logger: LoggerService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('enter')
  async handleQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() player: { id: string; mmr: number; matchId },
  ): Promise<void> {
    await client.join(player.matchId);

    if (this.rooms[player.matchId]) this.rooms[player.matchId].push(player.id);
    else this.rooms[player.matchId] = [player.id];

    if (this.rooms[player.matchId].length === 2)
      this.server.in(player.matchId).emit('message', '경기를 시작합니다.');
  }

  afterInit() {
    this.logger.warn('socket server is running');
  }

  handleConnection(client: Socket) {
    this.logger.info(`Client Connected : ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.info(`Client Disconnected : ${client.id}`);
  }
}
