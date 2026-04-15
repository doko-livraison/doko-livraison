import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission, MissionStatus } from './mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { User } from '../users/user.entity';
import { Transporter } from '../transporters/transporter.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
    @InjectRepository(Transporter) private transporterRepo: Repository<Transporter>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async create(dto: CreateMissionDto, clientId: string): Promise<Mission> {
    const client = await this.userRepo.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client introuvable');

    const mission = this.missionRepo.create({ ...dto, client });
    const saved = await this.missionRepo.save(mission);

    // Envoi emails (non bloquant)
    this.mailService.sendNewMissionToManager(saved, client).catch(() => {});
    this.mailService.sendMissionConfirmationToClient(saved, client.email, client.firstName).catch(() => {});

    return saved;
  }

  async findAll(): Promise<Mission[]> {
    return this.missionRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findPending(): Promise<Mission[]> {
    return this.missionRepo.find({
      where: { status: MissionStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async findByClient(clientId: string): Promise<Mission[]> {
    return this.missionRepo.find({
      where: { client: { id: clientId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTransporter(transporterId: string): Promise<Mission[]> {
    return this.missionRepo.find({
      where: { transporter: { id: transporterId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Mission> {
    const mission = await this.missionRepo.findOne({ where: { id } });
    if (!mission) throw new NotFoundException('Mission introuvable');
    return mission;
  }

  async accept(missionId: string, transporterUserId: string): Promise<Mission> {
    const mission = await this.findOne(missionId);
    if (mission.status !== MissionStatus.PENDING)
      throw new ForbiddenException('Mission non disponible');

    const transporter = await this.transporterRepo.findOne({
      where: { user: { id: transporterUserId } },
    });
    if (!transporter) throw new NotFoundException('Profil transporteur introuvable');

    mission.transporter = transporter;
    mission.status = MissionStatus.ACCEPTED;
    return this.missionRepo.save(mission);
  }

  async updateStatus(missionId: string, status: MissionStatus): Promise<Mission> {
    const mission = await this.findOne(missionId);
    mission.status = status;
    if (status === MissionStatus.VALIDATED) mission.completedAt = new Date();
    return this.missionRepo.save(mission);
  }

  async submitProof(missionId: string, proofPhotoUrl: string, signatureUrl?: string): Promise<Mission> {
    const mission = await this.findOne(missionId);
    mission.proofPhotoUrl = proofPhotoUrl;
    if (signatureUrl) mission.signatureUrl = signatureUrl;
    mission.status = MissionStatus.DELIVERED;
    return this.missionRepo.save(mission);
  }
}
