import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PaginatedList } from '@libs/interfaces/common';
import { Invoice } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import { GetOneInvoiceDTO, ListInvoicesDTO } from './dto';
import { AuthRequest } from '@libs/interfaces/auth';
import { GetOneInvoice } from './interfaces';
import { JwtAccessGuard } from '@libs/guards/jwt';

@UseGuards(JwtAccessGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get()
  public list(
    @Query() dto: ListInvoicesDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaginatedList<Invoice>> {
    return this.invoiceService.index(dto, user);
  }

  @Get(':id')
  public getOne(
    @Param() { id }: IdDTO,
    @Query() dto: GetOneInvoiceDTO,
  ): Promise<Invoice> {
    const data: GetOneInvoice = {
      id,
      dto,
    };

    return this.invoiceService.getOne(data);
  }
}
