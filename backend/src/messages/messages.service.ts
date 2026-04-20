import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Mission } from '../missions/mission.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepo: Repository<Message>,
    @InjectRepository(Mission) private missionsRepo: Repository<Mission>,
  ) {}

  async getByMission(missionId: string, userId: string): Promise<Message[]> {
    const mission = await this.missionsRepo.findOne({ where: { id: missionId } });
    if (!mission) throw new ForbiddenException('Mission not found');
    const isParticipant =
      mission.client?.id === userId ||
      (mission.transporter as any)?.user?.id === userId;
    if (!isParticipant) throw new ForbiddenException('Not a participant');
    return this.messagesRepo.find({
      where: { missionId },
      order: { createdAt: 'ASC' },
    });
  }

  async send(missionId: string, senderId: string, content: string): Promise<Message> {
    const msg = this.messagesRepo.create({ missionId, senderId, content });
    return this.messagesRepo.save(msg);
  }
}
