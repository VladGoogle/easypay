import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { LedgerService } from './ledger.service';
import { JwtAccessGuard } from '@libs/guards/jwt';
import { IdDTO } from '@libs/dto';
import { FundLedger } from '@libs/entities';
import { GetOneLedgerTransactionsDTO, ListLedgerTransactionsDTO } from './dto';
import { GetOneLedgerTransaction } from './interfaces';
import { PaginatedList } from '@libs/interfaces/common';

@UseGuards(JwtAccessGuard)
@Controller('ledger-transactions')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}

  @Get()
  public list(
    @Query() dto: ListLedgerTransactionsDTO,
  ): Promise<PaginatedList<FundLedger>> {
    return this.ledgerService.index(dto);
  }

  @Get(':id')
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
