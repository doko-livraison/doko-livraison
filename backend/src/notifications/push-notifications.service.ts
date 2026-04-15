import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../users/user.entity';

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: object;
}

@Injectable()
export class PushNotificationsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async registerToken(userId: string, pushToken: string): Promise<void> {
    await this.userRepo.update(userId, { pushToken });
  }

  async sendToUser(userId: string, title: string, body: string, data?: object): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user?.pushToken) return;
    await this.sendPushMessages([{ to: user.pushToken, title, body, data }]);
  }

  async sendToUsers(userIds: string[], title: string, body: string, data?: object): Promise<void> {
    const users = await this.userRepo.find({ where: { id: In(userIds) } });
    const messages: ExpoPushMessage[] = users
      .filter(u => u.pushToken)
      .map(u => ({ to: u.pushToken!, title, body, data }));
    if (messages.length) await this.sendPushMessages(messages);
  }

  private async sendPushMessages(messages: ExpoPushMessage[]): Promise<void> {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
        },
        body: JSON.stringify(messages),
      });
    } catch (err) {
      console.error('Push notification error:', err);
    }
  }
}
