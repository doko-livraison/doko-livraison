import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporter, VehicleType } from './transporter.entity';
import { User } from '../users/user.entity';

export class CreateTransporterDto {
  vehicleType: VehicleType;
  maxLoadKg: number;
  serviceZones: string[];
  prestationTypes: string[];
  siret?: string;
}

@Injectable()
export class TransportersService {
  constructor(
    @InjectRepository(Transporter) private transporterRepo: Repository<Transporter>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createProfile(dto: CreateTransporterDto, userId: string): Promise<Transporter> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const transporter = this.transporterRepo.create({ ...dto, user });
    return this.transporterRepo.save(transporter);
  }

  async findAll(): Promise<Transporter[]> {
    return this.transporterRepo.find();
  }

  async findByUser(userId: string): Promise<Transporter> {
    const t = await this.transporterRepo.findOne({ where: { user: { id: userId } } });
    if (!t) throw new NotFoundException('Profil transporteur introuvable');
    return t;
  }

  async findOne(id: string): Promise<Transporter> {
    const t = await this.transporterRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Transporteur introuvable');
    return t;
  }

  async updateAvailability(userId: string, isAvailable: boolean): Promise<Transporter> {
    const transporter = await this.findByUser(userId);
    transporter.isAvailable = isAvailable;
    return this.transporterRepo.save(transporter);
  }

  async updateRating(transporterId: string, newRating: number): Promise<void> {
    const transporter = await this.findOne(transporterId);
    const total = transporter.rating * transporter.totalMissions + newRating;
    transporter.totalMissions += 1;
    transporter.rating = total / transporter.totalMissions;
    await this.transporterRepo.save(transporter);
  }
}
