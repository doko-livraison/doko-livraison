import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Transporter } from '../transporters/transporter.entity';

export enum MissionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  DELIVERED = 'delivered',
  VALIDATED = 'validated',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export enum DeliveryType {
  COLIS = 'colis',
  MEUBLES = 'meubles',
  ELECTROMENAGER = 'electromenager',
  MATERIAUX = 'materiaux',
  MARCHANDISES = 'marchandises',
  DOCUMENTS = 'documents',
  DEMENAGEMENT = 'demenagement',
}

@Entity('missions')
export class Mission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  client: User;

  @ManyToOne(() => Transporter, { nullable: true, eager: true })
  @JoinColumn()
  transporter: Transporter;

  @Column({ type: 'enum', enum: DeliveryType })
  deliveryType: DeliveryType;

  @Column({ type: 'text', array: true, default: [] })
  deliveryTypes: string[];

  @Column({ type: 'enum', enum: MissionStatus, default: MissionStatus.PENDING })
  status: MissionStatus;

  @Column()
  pickupAddress: string;

  @Column()
  deliveryAddress: string;

  @Column({ type: 'float', nullable: true })
  estimatedWeightKg: number;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'text', array: true, default: [] })
  photoUrls: string[];

  @Column({ default: false })
  needsHandling: boolean;

  @Column({ default: false })
  hasStairs: boolean;

  @Column({ default: false })
  noElevator: boolean;

  @Column({ default: false })
  fragile: boolean;

  @Column({ nullable: true })
  floorNumber: number;

  @Column({ default: false })
  multipleHelpers: boolean;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'float', nullable: true })
  deposit: number;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  proofPhotoUrl: string;

  @Column({ nullable: true })
  signatureUrl: string;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column({ nullable: true })
  depositPaidAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
