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

import { QueueService } from './queue.service';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'queues',
  cors: true,
})
export class QueueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private sockets = [];

  constructor(
    private readonly logger: LoggerService,
    private readonly queueService: QueueService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('addQueue')
  async handleQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() player: { id: string; mmr: number },
  ): Promise<void> {
    this.server.to(client.id).emit('message', '대기열 등록이 완료되었습니다.');

    const { matchId } = await this.queueService.findMatch(player);

    this.server.to(client.id).emit('message', '매치를 찾았습니다!');
    this.server.to(client.id).emit('match', matchId);
  }

  afterInit() {
    this.logger.warn('socket server is running');
  }

  handleConnection(client: Socket) {
    this.sockets.push(client.id);

    this.logger.info(`Client Connected : ${client.id}`);

    this.server.to(client.id).emit('message', {
      connections: this.sockets.length,
    });
  }

  handleDisconnect(client: Socket) {
    this.sockets.splice(
      this.sockets.findIndex(socket => socket === client.id),
      1,
    );

    this.logger.info(`Client Disconnected : ${client.id}`);
  }
}
