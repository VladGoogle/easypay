import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from '@libs/interfaces/auth';
import { QueueClientService } from '@libs/queue-client';
import { JwtAccessGuard } from '@libs/guards/jwt';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Generate Receipt endpoints')
@UseGuards(JwtAccessGuard)
@Controller()
export class GenerateReceiptController {
  constructor(private readonly queue: QueueClientService) {}

  @Get('transactions/:id/receipt')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description:
      'Returns message about starting the process of receipt generating',
    example: {
      message:
        'Your receipt is generating. You will receive a notification when it will be finished',
    },
  })
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
