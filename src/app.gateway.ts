import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


// @WebSocketGateway(0, {namespace: 'delivery', cors: {origin: '*'}})
@WebSocketGateway({namespace: /^\/\w+$/, cors: {origin: '*'}})
export class AppGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {

  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    console.log('connected', client.nsp.name, client.handshake.headers['origin']);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected', client.nsp.name, client.handshake.headers['origin']);
  }

  // @SubscribeMessage('join')
  // join(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: Message
  // ): void {
  //   client.join(payload.domain);
  //   console.log('join', client.id, payload);
  // }

  @SubscribeMessage('status')
  status(
    @ConnectedSocket() client: Socket,
    // client: Socket,
    @MessageBody() payload: Message
  ): void {
    // client.to(payload.domain).emit('status-change', payload);
    // client.broadcast.to(payload.domain).emit('status-change', payload);
    const { domain } = payload;
    // this.server.to(payload.domain).emit(ev, payload);
    this.server.emit(domain, payload);
    console.log('message: ', client.id, payload);
  }

}

export interface Message {
  domain: string;
  order: number;
  status: string;
}