import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';

import { IdDTO } from '@libs/dto';
import { Beneficiary, PaymentAccount, Transaction } from '@libs/entities';
import { JwtAccessGuard } from '@libs/guards/jwt';

import { BeneficiariesService } from './beneficiaries.service';
import { GetOneBeneficiaryDTO } from './dto';
import { GetOneBeneficiary } from './interfaces';
import { PaginatedList } from '@libs/interfaces/common';
import { AuthRequest } from '@libs/interfaces/auth';
import { ListBeneficiariesDTO } from './dto/list.dto';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  public list(
    @Query() dto: ListBeneficiariesDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaginatedList<Beneficiary>> {
    return this.beneficiariesService.index(dto, user);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  public getOne(
    @Param() { id }: IdDTO,
    @Query() dto: GetOneBeneficiaryDTO,
  ): Promise<Beneficiary> {
    const data: GetOneBeneficiary = {
      id,
      dto,
    };

    return this.beneficiariesService.getOne(data);
  }
}
