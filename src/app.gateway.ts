import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: /^\/\w+$/, cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    console.log(
      'connected',
      client.nsp.name,
      client.handshake.headers['origin'],
    );
  }

  handleDisconnect(client: Socket) {
    console.log(
      'disconnected',
      client.nsp.name,
      client.handshake.headers['origin'],
    );
  }

  @SubscribeMessage('status')
  status(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: Message,
  ): void {
    const { domain } = payload;
    console.log(client.nsp.name, client.id, payload);
    this.server.emit(domain, payload);
  }
}

export interface Message {
  domain: string;
  order: number;
  status: string;
}