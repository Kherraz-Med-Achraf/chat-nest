import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from '../chat/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ default: '#3498db' })
  color: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
