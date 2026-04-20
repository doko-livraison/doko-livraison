import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: string) {
    client.join(`user:${userId}`);
  }

  notifyNewMission(transporterIds: string[], mission: any) {
    transporterIds.forEach(id => {
      this.server.to(`user:${id}`).emit('new_mission', mission);
    });
  }

  notifyMissionAccepted(clientId: string, mission: any) {
    this.server.to(`user:${clientId}`).emit('mission_accepted', mission);
  }

  notifyMissionDelivered(clientId: string, mission: any) {
    this.server.to(`user:${clientId}`).emit('mission_delivered', mission);
  }
}
