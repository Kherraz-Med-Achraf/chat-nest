import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@WebSocketGateway({ cors: { origin: '*' }, path: '/ws' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private online = new Map<number, string>();

  constructor(
    private jwt: JwtService,
    private chat: ChatService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const raw = client.handshake.auth.token as string;
      const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw;
      const payload = this.jwt.verify<{ sub: number; username: string }>(token);

      const userId = payload.sub;
      console.log('WS OK pour user', userId);
      client.data.userId = userId;

      client.join('lobby');

      this.online.set(userId, client.id);
      await this.broadcastOnline();
    } catch (e) {
      console.warn('WS DENIED', e.message);

      client.disconnect(true);
    }
  }

  private async broadcastOnline() {
    const ids = [...this.online.keys()];
    const users = ids.length
      ? await this.userRepo.find({ where: { id: In(ids) } })
      : [];

    this.server.to('lobby').emit('users.online', users);
  }

  async handleDisconnect(client: Socket) {
    this.online.delete(client.data.userId);
    await this.broadcastOnline();
  }

  @SubscribeMessage('chat.start')
  async startChat(client: Socket, { targetId }: { targetId: number }) {
    const senderId = client.data.userId;
    const room = this.chat.roomName(senderId, targetId);

    client.join(room);

    const targetSocketId = this.online.get(targetId);
    if (targetSocketId) {
      const targetSocket = this.server.sockets.sockets.get(targetSocketId);
      targetSocket?.join(room);

      targetSocket?.emit('chat.open', {
        room,
        with: await this.userRepo.findOneBy({ id: senderId }),
      });
    }

    const history = await this.chat.history(senderId, targetId);
    this.server.to(room).emit('chat.history', { room, history });
  }

  @SubscribeMessage('chat.message')
  async handleMessage(
    client: Socket,
    payload: { room: string; to: number; content: string },
  ) {
    const senderId = client.data.userId;
    const msg = await this.chat.saveMessage(
      senderId,
      payload.to,
      payload.content,
    );
    this.server.to(payload.room).emit('chat.message', msg);
  }
}
