import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { JwtAccessGuard } from '@libs/guards/jwt';
import { IdDTO } from '@libs/dto';
import { FundLedger } from '@libs/entities';
import {
  GetOneLedgerTransactionsDTO,
  ListLedgersResponseDTO,
  ListLedgerTransactionsDTO,
} from './dto';
import { GetOneLedgerTransaction } from './interfaces';
import { PaginatedList } from '@libs/interfaces/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Ledger endpoints')
@UseGuards(JwtAccessGuard)
@Controller('ledger-transactions')
@ApiBearerAuth()
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns list of ledger transactions',
    type: ListLedgersResponseDTO,
  })
  public list(
    @Query() dto: ListLedgerTransactionsDTO,
  ): Promise<PaginatedList<FundLedger>> {
    return this.ledgerService.index(dto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns ledger transaction by id',
    type: FundLedger,
  })
  public getOne(
    @Param() { id }: IdDTO,
    @Query() dto: GetOneLedgerTransactionsDTO,
  ): Promise<FundLedger> {
    const data: GetOneLedgerTransaction = {
      id,
      dto,
    };

    return this.ledgerService.getOne(data);
  }
}
