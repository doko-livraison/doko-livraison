import {
  Controller, Get, Post, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':missionId')
  getByMission(@Param('missionId') missionId: string, @Request() req: any) {
    return this.messagesService.getByMission(missionId, req.user.id);
  }

  @Post(':missionId')
  send(
    @Param('missionId') missionId: string,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    return this.messagesService.send(missionId, req.user.id, content);
  }
}
