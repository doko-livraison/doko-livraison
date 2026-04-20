import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transporter } from './transporter.entity';
import { TransportersController } from './transporters.controller';
import { TransportersService } from './transporters.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transporter, User])],
  controllers: [TransportersController],
  providers: [TransportersService],
  exports: [TransportersService],
})
export class TransportersModule {}
