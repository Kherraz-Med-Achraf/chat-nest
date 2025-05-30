import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  roomName(u1: number, u2: number) {
    return `private-${[u1, u2].sort().join('-')}`;
  }

  async saveMessage(senderId: number, receiverId: number, content: string) {
    const [sender, receiver] = await Promise.all([
      this.userRepo.findOneBy({ id: senderId }),
      this.userRepo.findOneBy({ id: receiverId }),
    ]);
    const msg = this.msgRepo.create({
      sender,
      receiver,
      content,
    } as DeepPartial<Message>);
    return this.msgRepo.save(msg);
  }
  async history(a: number, b: number): Promise<Message[]> {
    return this.msgRepo.find({
      where: [
        { sender: { id: a }, receiver: { id: b } },
        { sender: { id: b }, receiver: { id: a } },
      ],
      order: { createdAt: 'ASC' },
    });
  }
}
