import { Injectable, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { environment } from 'environment/environment';
import { Server, Socket } from 'socket.io';
import { ValidationPipe } from '../pipes/validation';

@WebSocketGateway(environment.ws_port, {
  transports: ['websocket'],
})
@Injectable()
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');
  private clients = {};

  // @UseFilters(WsExceptionFilter)
  @SubscribeMessage('message')
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) payload: any,
  ): Promise<WsResponse<any>> {
    console.log('send message', payload);
    payload.client_id = client.id;
    this.server.sockets.emit('receive_message', payload);
    return;
  }

  @SubscribeMessage('private')
  public handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) payload: any,
  ): Promise<WsResponse<any>> {
    const { to, message } = payload;
    this.server.to(to).emit('private_message', { message, from: client.id });
    return;
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, data): void {
    const { room } = data;
    console.log('joinRoom', room);
    client.join(room);
    client.to(room).emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    console.log('leaveRoom', room);
    client.leave(room);
    client.emit('leftRoom', room);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket): void {
    this.server.emit('getId', client.id);
    // console.log(client.handshake);
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
