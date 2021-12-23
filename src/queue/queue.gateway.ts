import { Server, Socket } from 'socket.io';
import { LoggerService } from 'src/common/logger/logger.service';

import {
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
  constructor(
    private readonly logger: LoggerService,
    private readonly queueService: QueueService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('addQueue')
  async handleMessage(
    @MessageBody() player: { id: string; mmr: number },
  ): Promise<void> {
    this.server.emit('message', '대기열 등록이 완료되었습니다.');

    await this.queueService.findMatch(player);

    this.server.emit('message', '매치를 찾았습니다!');

    return;
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
