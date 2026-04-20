import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    // Connection handled
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { missionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`mission:${data.missionId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { missionId: string; senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const msg = await this.messagesService.send(data.missionId, data.senderId, data.content);
    this.server.to(`mission:${data.missionId}`).emit('newMessage', msg);
    return msg;
  }
}
