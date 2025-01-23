import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';

import { IdDTO } from '@libs/dto';
import { PaymentAccount } from '@libs/entities';
import { JwtAdminAccessGuard } from '@libs/guards/jwt';

import { AccountsService } from '../accounts.service';
import { AdminUpdateAccountDTO } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Payment Accounts admin endpoints')
@UseGuards(JwtAdminAccessGuard)
@Controller('admin/accounts')
export class AdminAccountsController {
  constructor(private readonly service: AccountsService) {}

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: AdminUpdateAccountDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated PaymentAccount entity',
    type: PaymentAccount,
  })
  public update(
    @Body() dto: AdminUpdateAccountDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.update(id, dto);
  }
}
