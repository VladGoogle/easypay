import {
  Body,
  Controller,
  Post,
  Headers,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';

import { AuthRequest } from '@libs/interfaces/auth';
import { Jwt2faAccessGuard } from '@libs/guards/jwt';

import { SumsubService } from './sumsub.service';
import { GetAppTokenDTO } from './dto';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('SumSub endpoints')
@Controller('sumsub')
export class SumsubController {
  constructor(private readonly service: SumsubService) {}

  @ApiExcludeEndpoint()
  @Post('webhook')
  async handleWebhook(
    @Body() payload: any,
    @Headers('X-Signature') signature: string, // Assuming the webhook includes a signature header
    @Res() res: Response,
  ) {
    console.log('Webhook received:', payload);
    console.log('Signature:', signature);

    await this.service.handleEvent(payload);
  }

  @UseGuards(Jwt2faAccessGuard)
  @ApiOkResponse({
    description: 'Returns SumSub KYC object',
  })
  @Get('start-kyc')
  async startKycProcess(@Req() { user }: AuthRequest) {
    const { id } = user;

    return await this.service.startKycFlow(id);
  }

  @ApiExcludeEndpoint()
  @UseGuards(Jwt2faAccessGuard)
  @Post('access-token')
  async getAppToken(@Body() dto: GetAppTokenDTO) {
    return await this.service.getAppToken(dto);
  }
}
