import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Transporter } from '../transporters/transporter.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Transporter])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
