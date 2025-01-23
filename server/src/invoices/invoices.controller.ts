import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { PaginatedList } from '@libs/interfaces/common';
import { Invoice } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import {
  GetOneInvoiceDTO,
  ListInvoicesDTO,
  ListInvoicesResponseDTO,
} from './dto';
import { AuthRequest } from '@libs/interfaces/auth';
import { GetOneInvoice } from './interfaces';
import { JwtAccessGuard } from '@libs/guards/jwt';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Invoices endpoints')
@UseGuards(JwtAccessGuard)
@Controller('invoices')
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns list of invoices',
    type: ListInvoicesResponseDTO,
  })
  public list(
    @Query() dto: ListInvoicesDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaginatedList<Invoice>> {
    return this.invoiceService.index(dto, user);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns invoice by id',
    type: Invoice,
  })
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
