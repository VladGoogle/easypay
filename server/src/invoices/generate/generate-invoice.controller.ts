import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '@libs/interfaces/auth';
import { QueueClientService } from '@libs/queue-client';
import { JwtAccessGuard } from '@libs/guards/jwt';
import { ListLedgerTransactionsDTO } from '../../ledger/dto';

@UseGuards(JwtAccessGuard)
@Controller()
export class GenerateInvoiceController {
  constructor(private readonly queue: QueueClientService) {}

  @Get('accounts/:id/invoice')
  async generateInvoice(
    @Req() { user }: AuthRequest,
    @Query() dto: ListLedgerTransactionsDTO,
  ): Promise<{ message: string }> {
    await this.queue.messagingHub.add('invoice.build.vars', {
      dto,
      params: user,
    });

    return {
      message:
        'Your invoice is generating. You will receive a notification when it will be finished',
    };
  }
}
