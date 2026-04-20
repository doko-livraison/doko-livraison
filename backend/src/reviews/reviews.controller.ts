import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  submit(
    @Body() body: { missionId: string; transporterId: string; rating: number; comment?: string },
    @Request() req: any,
  ) {
    return this.reviewsService.submit(
      req.user.id,
      body.missionId,
      body.transporterId,
      body.rating,
      body.comment,
    );
  }

  @Get('transporter/:id')
  getForTransporter(@Param('id') id: string) {
    return this.reviewsService.getForTransporter(id);
  }
}
