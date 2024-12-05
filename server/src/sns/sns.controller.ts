import { Body, Controller, Post } from '@nestjs/common';

import { SnsNotification } from './interfaces';
import { SnsService } from './sns.service';

@Controller('sns')
export class SnsController {
  constructor(private readonly service: SnsService) {}

  @Post('webhook')
  public async handle(@Body() body: SnsNotification): Promise<string> {
    return this.service.processNotification(body);
  }
}
