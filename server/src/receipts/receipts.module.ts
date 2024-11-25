import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptListener } from './receipt.listener';
import { ReceiptsService } from './receipts.service';
import { LedgerModule } from '../ledger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from '@libs/entities';
import { AWSClientModule } from '@libs/aws-client';
import { AWSConfigModule } from '@libs/config';
import { PdfRenderModule } from '@libs/pdf-render';
import { GenerateReceiptService } from './generate/generate-receipt.service';
import { GenerateReceiptListener } from './generate/generate-receipt.listener';
import { GenerateReceiptController } from './generate';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt]),
    LedgerModule,
    AWSClientModule,
    AWSConfigModule,
    PdfRenderModule,
  ],
  controllers: [ReceiptsController, GenerateReceiptController],
  providers: [
    ReceiptListener,
    ReceiptsService,
    GenerateReceiptService,
    GenerateReceiptListener,
  ],
})
export class ReceiptsModule {}
