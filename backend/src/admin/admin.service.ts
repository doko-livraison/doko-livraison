import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Mission, MissionStatus } from '../missions/mission.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
  ) {}

  async getStats() {
    const totalUsers = await this.userRepo.count();
    const totalMissions = await this.missionRepo.count();
    const pendingMissions = await this.missionRepo.count({
      where: { status: MissionStatus.PENDING },
    });
    const missions = await this.missionRepo.find({ where: { status: MissionStatus.VALIDATED } });
    const totalRevenue = missions.reduce((sum, m) => sum + (m.price || 0), 0);

    return { totalUsers, totalMissions, pendingMissions, totalRevenue };
  }

  async getMissions() {
    return this.missionRepo.find({
      relations: ['client', 'transporter'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUsers() {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async suspendUser(id: string) {
    await this.userRepo.update(id, { isActive: false });
    return { success: true };
  }

  async cancelMission(id: string) {
    await this.missionRepo.update(id, { status: MissionStatus.CANCELLED });
    return { success: true };
  }
}
