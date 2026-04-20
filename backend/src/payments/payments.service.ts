import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Mission, MissionStatus } from '../missions/mission.entity';

@Injectable()
export class PaymentsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private stripe: any;

  constructor(
    @InjectRepository(Mission) private missionRepo: Repository<Mission>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  }

  async createDepositIntent(missionId: string, amount: number) {
    const mission = await this.missionRepo.findOne({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission introuvable');

    const depositAmount = Math.round(amount * 0.30 * 100); // 30% acompte en centimes
    const intent = await this.stripe.paymentIntents.create({
      amount: depositAmount,
      currency: 'eur',
      metadata: { missionId, type: 'deposit' },
    });

    mission.deposit = amount * 0.30;
    mission.price = amount;
    mission.stripePaymentIntentId = intent.id;
    await this.missionRepo.save(mission);

    return { clientSecret: intent.client_secret, depositAmount: amount * 0.30 };
  }

  async confirmDeposit(missionId: string) {
    const mission = await this.missionRepo.findOne({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission introuvable');

    mission.depositPaidAt = new Date();
    await this.missionRepo.save(mission);
    return { success: true };
  }

  async releasePayment(missionId: string) {
    const mission = await this.missionRepo.findOne({ where: { id: missionId } });
    if (!mission) throw new NotFoundException('Mission introuvable');

    const remainingAmount = Math.round((mission.price - mission.deposit) * 100);
    const intent = await this.stripe.paymentIntents.create({
      amount: remainingAmount,
      currency: 'eur',
      metadata: { missionId, type: 'final' },
    });

    mission.status = MissionStatus.VALIDATED;
    mission.completedAt = new Date();
    await this.missionRepo.save(mission);

    return { clientSecret: intent.client_secret };
  }
}
