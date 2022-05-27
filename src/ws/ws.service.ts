import { Injectable, Logger, UseFilters } from '@nestjs/common';
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
import { WsExceptionFilter } from '../filters';
import { ValidationPipe } from '../pipes/validation';

@WebSocketGateway(environment.ws_port, {
  transports: ['websocket', 'polling'],
})
@Injectable()
export class WsService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('message')
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(ValidationPipe) payload: any,
  ): Promise<WsResponse<any>> {
    console.log('payload', payload);
    this.server.to(payload.id).emit('message', payload);
    return;
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
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
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
