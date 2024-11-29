import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '@libs/interfaces/auth';
import { QueueClientService } from '@libs/queue-client';
import { JwtAccessGuard } from '@libs/guards/jwt';

@UseGuards(JwtAccessGuard)
@Controller()
export class GenerateReceiptController {
  constructor(private readonly queue: QueueClientService) {}

  @Get('transactions/:id/receipt')
  async generateDevicePDF(
    @Req() { user }: AuthRequest,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.queue.messagingHub.add('receipt.build.vars', {
      id,
      params: user,
    });

    return {
      message:
        'Your receipt is generating. You will receive a notification when it will be finished',
    };
  }
}
