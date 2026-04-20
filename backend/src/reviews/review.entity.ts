import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Mission } from '../missions/mission.entity';
import { Transporter } from '../transporters/transporter.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author: User;

  @ManyToOne(() => Transporter)
  @JoinColumn()
  transporter: Transporter;

  @ManyToOne(() => Mission)
  @JoinColumn()
  mission: Mission;

  @Column({ type: 'int' })
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
