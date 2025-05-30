import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  //me
  async whoIam(username: string) {
    const user = await this.findByUsername(username);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async updateProfile(
    userId: number,
    data: { username?: string; email?: string },
  ) {
    await this.usersRepository.update(userId, data);
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new Error('Mot de passe actuel incorrect');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await this.usersRepository.save(user);

    return { message: 'Mot de passe modifié' };
  }
}
