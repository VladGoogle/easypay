import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '@libs/entities';
import { LedgerModule } from '../ledger';
import { AWSClientModule } from '@libs/aws-client';
import { AWSConfigModule } from '@libs/config';
import { PdfRenderModule } from '@libs/pdf-render';
import { GenerateInvoiceController } from './generate';
import { InvoicesListener } from './invoices.listener';
import { GenerateInvoiceService } from './generate/generate-invoice.service';
import { GenerateInvoiceListener } from './generate/generate-invoice.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    LedgerModule,
    AWSClientModule,
    AWSConfigModule,
    PdfRenderModule,
  ],
  controllers: [InvoicesController, GenerateInvoiceController],
  providers: [
    InvoicesListener,
    InvoicesService,
    GenerateInvoiceService,
    GenerateInvoiceListener,
  ],
})
export class InvoicesModule {}
