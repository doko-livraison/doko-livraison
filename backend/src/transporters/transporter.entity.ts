import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum VehicleType {
  MOTO = 'moto',
  BREAK = 'break',
  FOURGON = 'fourgon',
  CAMION = 'camion',
  POIDS_LOURD = 'poids_lourd',
}

@Entity('transporters')
export class Transporter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: VehicleType })
  vehicleType: VehicleType;

  @Column({ type: 'float', default: 0 })
  maxLoadKg: number;

  @Column({ type: 'text', array: true, default: [] })
  serviceZones: string[];

  @Column({ type: 'text', array: true, default: [] })
  prestationTypes: string[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  siret: string;

  @Column({ nullable: true })
  licenseUrl: string;

  @Column({ nullable: true })
  insuranceUrl: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalMissions: number;

  @Column({ nullable: true })
  stripeAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
