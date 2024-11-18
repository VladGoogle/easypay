import {
  Body,
  Controller,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { IdDTO } from '@libs/dto';
import { PaymentAccount } from '@libs/entities';
import { JwtAdminAccessGuard } from '@libs/guards/jwt';

import { AccountsService } from '../accounts.service';
import { AdminUpdateAccountDTO } from './dto';

@UseGuards(JwtAdminAccessGuard)
@Controller('admin/accounts')
export class AdminAccountsController {
  constructor(private readonly service: AccountsService) {}

  @Patch(':id')
  public update(
    @Body() dto: AdminUpdateAccountDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.update(id, dto);
  }
}
