import { Controller, Get, Param, Query } from '@nestjs/common';
import { Receipt } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import { ReceiptsService } from './receipts.service';
import { GetOneReceiptDTO } from './dto';
import { GetOneReceipt } from './interfaces';

@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Get(':id')
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
