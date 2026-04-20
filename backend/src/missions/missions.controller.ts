import {
  Controller, Get, Post, Patch, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MissionStatus } from './mission.entity';

@UseGuards(JwtAuthGuard)
@Controller('missions')
export class MissionsController {
  constructor(private missionsService: MissionsService) {}

  @Post()
  create(@Body() dto: CreateMissionDto, @Request() req) {
    return this.missionsService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.missionsService.findAll();
  }

  @Get('pending')
  findPending() {
    return this.missionsService.findPending();
  }

  @Get('my')
  findMyMissions(@Request() req) {
    return this.missionsService.findByClient(req.user.id);
  }

  @Get('transporter')
  findTransporterMissions(@Request() req) {
    return this.missionsService.findByTransporter(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Request() req) {
    return this.missionsService.accept(id, req.user.id);
  }

  @Patch(':id/proof')
  submitProof(
    @Param('id') id: string,
    @Body() body: { proofPhotoUrl: string; signatureUrl?: string },
  ) {
    return this.missionsService.submitProof(id, body.proofPhotoUrl, body.signatureUrl);
  }

  @Patch(':id/validate')
  validate(@Param('id') id: string) {
    return this.missionsService.updateStatus(id, MissionStatus.VALIDATED);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.missionsService.updateStatus(id, MissionStatus.CANCELLED);
  }
}
