import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Name } from '@libs/enums/queue';
import { QueueClientService } from '@libs/queue-client';
import { AWSConfigService } from '@libs/config';
import { RenderPdf } from '@libs/interfaces/render-pdf';
import { InvoicePayload, InvoiceVars } from './interfaces';
import { PdfRenderService } from '@libs/pdf-render';
import { AWSClientService } from '@libs/aws-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v7 as uuidv7 } from 'uuid';
import { GenerateInvoiceService } from './generate-invoice.service';
import { DeepPartial } from 'typeorm';
import { Invoice } from '@libs/entities';

@Processor(Name.MessagingHub)
export class GenerateInvoiceListener {
  constructor(
    private readonly awsService: AWSClientService,
    private readonly config: AWSConfigService,
    private readonly pdfService: PdfRenderService,
    private readonly generateService: GenerateInvoiceService,
    private readonly queue: QueueClientService,
  ) {}

  @Process('invoice.upload')
  async uploadInvoice(job: Job) {
    const { vars, templatePath, s3Key, userId, accountId } =
      job.data as InvoicePayload;

    const renderPdfPayload: RenderPdf<InvoiceVars> = {
      templatePath,
      vars,
    };

    const buffer = await this.pdfService.renderPdf(renderPdfPayload);

    const tokensExist = job.data?.tokens?.length;

    try {
      const command = new PutObjectCommand({
        Bucket: this.config.invoicesBucket,
        Key: s3Key,
        Body: buffer,
        ContentType: 'application/pdf',
      });

      await this.awsService.s3Client.send(command);
    } catch (e: any) {
      if (tokensExist) {
        const tokens = job.data.tokens;

        const notification = {
          title: 'Alert!',
          body: `Something went wrong during the process of invoice generation.`,
        };

        const messages = tokens.map((token) => {
          const data = {
            notification,
            message: JSON.stringify(e.stack),
            token,
            id: userId,
          };

          return this.queue.messagingHub.add('firebase.send', {
            data,
          });
        });

        await Promise.all(messages);
      }

      console.log(e);
    }

    if (tokensExist) {
      const tokens = job.data.tokens;

      const notification = {
        title: 'Alert!',
        body: `Your invoice for the account with id = ${accountId} is ready.`,
      };

      const payload = {
        key: s3Key,
      };

      const promises = tokens.map((token) => {
        const data = {
          notification,
          message: payload,
          token,
          id: userId,
        };

        return this.queue.messagingHub.add('firebase.send', {
          data,
        });
      });

      await Promise.all(promises);
    }

    const invoiceDto: DeepPartial<Invoice> = {
      id: uuidv7(),
      key: s3Key,
      accountId,
    };

    await this.queue.messagingHub.add('invoice.create', {
      dto: invoiceDto,
    });
  }

  @Process('invoice.build.vars')
  async buildInvoice(job: Job) {
    const { dto, params } = job.data;

    await this.generateService.generate(dto, params);
  }
}
