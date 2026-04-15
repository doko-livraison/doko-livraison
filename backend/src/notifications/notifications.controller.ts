import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly pushService: PushNotificationsService) {}

  @Post('register-token')
  registerToken(@Body('pushToken') pushToken: string, @Request() req: any) {
    return this.pushService.registerToken(req.user.id, pushToken);
  }
}
