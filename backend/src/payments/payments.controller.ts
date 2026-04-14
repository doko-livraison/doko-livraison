import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('deposit/:missionId')
  createDeposit(@Param('missionId') id: string, @Body() body: { amount: number }) {
    return this.paymentsService.createDepositIntent(id, body.amount);
  }

  @Post('deposit/:missionId/confirm')
  confirmDeposit(@Param('missionId') id: string) {
    return this.paymentsService.confirmDeposit(id);
  }

  @Post('release/:missionId')
  releasePayment(@Param('missionId') id: string) {
    return this.paymentsService.releasePayment(id);
  }
}
