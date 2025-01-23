import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { IdDTO } from '@libs/dto';
import { Beneficiary } from '@libs/entities';
import { JwtAccessGuard } from '@libs/guards/jwt';

import { BeneficiariesService } from './beneficiaries.service';
import { GetOneBeneficiaryDTO, ListBeneficiariesResponseDTO } from './dto';
import { GetOneBeneficiary } from './interfaces';
import { PaginatedList } from '@libs/interfaces/common';
import { AuthRequest } from '@libs/interfaces/auth';
import { ListBeneficiariesDTO } from './dto';

@ApiTags('Beneficiaries endpoints')
@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns list of beneficiaries',
    type: ListBeneficiariesResponseDTO,
  })
  public list(
    @Query() dto: ListBeneficiariesDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaginatedList<Beneficiary>> {
    return this.beneficiariesService.index(dto, user);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns beneficiary by id',
    type: Beneficiary,
  })
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
