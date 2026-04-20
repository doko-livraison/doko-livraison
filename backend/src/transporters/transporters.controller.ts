import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TransportersService, CreateTransporterDto } from './transporters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transporters')
export class TransportersController {
  constructor(private transportersService: TransportersService) {}

  @Post('profile')
  createProfile(@Body() dto: CreateTransporterDto, @Request() req) {
    return this.transportersService.createProfile(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.transportersService.findAll();
  }

  @Get('me')
  getMyProfile(@Request() req) {
    return this.transportersService.findByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportersService.findOne(id);
  }

  @Patch('availability')
  updateAvailability(@Body() body: { isAvailable: boolean }, @Request() req) {
    return this.transportersService.updateAvailability(req.user.id, body.isAvailable);
  }
}
