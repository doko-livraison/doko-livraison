import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Mission } from '../missions/mission.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mission, { onDelete: 'CASCADE' })
  @JoinColumn()
  mission: Mission;

  @Column()
  missionId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  sender: User;

  @Column()
  senderId: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
