import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { PushNotificationsService } from './push-notifications.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [NotificationsGateway, PushNotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsGateway, PushNotificationsService],
})
export class NotificationsModule {}
