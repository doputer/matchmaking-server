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

@WebSocketGateway({
  transports: ['websocket'],
  path: '/queues',
  namespace: 'queues',
  cors: true,
})
export class QueueGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly logger: LoggerService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('queue')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('queue', message);
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
