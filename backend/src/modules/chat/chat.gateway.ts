import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(client: Socket, payload: any) {
    client.join(payload.room);
    return { event: 'subscribed', data: payload };
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(client: Socket, payload: any) {
    client.leave(payload.room);
    return { event: 'unsubscribed', data: payload };
  }

  // Emit events to clients
  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }
}
