import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Transporter } from '../transporters/transporter.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewsRepo: Repository<Review>,
    @InjectRepository(Transporter) private transportersRepo: Repository<Transporter>,
  ) {}

  async submit(
    authorId: string,
    missionId: string,
    transporterId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    if (rating < 1 || rating > 5) throw new BadRequestException('Rating must be 1-5');
    const existing = await this.reviewsRepo.findOne({
      where: { author: { id: authorId }, mission: { id: missionId } },
    });
    if (existing) throw new BadRequestException('Already reviewed');

    const review = this.reviewsRepo.create({
      author: { id: authorId } as any,
      mission: { id: missionId } as any,
      transporter: { id: transporterId } as any,
      rating,
      comment,
    });
    const saved = await this.reviewsRepo.save(review);

    // Update transporter average rating
    const reviews = await this.reviewsRepo.find({
      where: { transporter: { id: transporterId } },
    });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.transportersRepo.update(transporterId, { rating: avg });

    return saved;
  }

  async getForTransporter(transporterId: string): Promise<Review[]> {
    return this.reviewsRepo.find({
      where: { transporter: { id: transporterId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
