import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Receipt } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import { ReceiptsService } from './receipts.service';
import { GetOneReceiptDTO } from './dto';
import { GetOneReceipt } from './interfaces';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessGuard } from '@libs/guards/jwt';

@ApiTags('Receipt endpoints')
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns receipt by id',
    type: Receipt,
  })
  public async getOne(
    @Param() { id }: IdDTO,
    @Query() dto: GetOneReceiptDTO,
  ): Promise<Receipt> {
    const data: GetOneReceipt = {
      id,
      dto,
    };

    return await this.service.getOne(data);
  }
}
