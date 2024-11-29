import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Name } from '@libs/enums/queue';
import { QueueClientService } from '@libs/queue-client';
import { AWSConfigService } from '@libs/config';
import { RenderPdf } from '@libs/interfaces/render-pdf';
import { InvoicePayload, InvoiceVars } from './interfaces';
import { PdfRenderService } from '@libs/pdf-render';
import { AWSClientService } from '@libs/aws-client';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { GenerateInvoiceService } from './generate-invoice.service';

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
    const { vars, templatePath, s3Key, userId } = job.data as InvoicePayload;

    const renderPdfPayload: RenderPdf<InvoiceVars> = {
      templatePath,
      vars,
    };

    const buffer = await this.pdfService.renderPdf(renderPdfPayload);

    const tokensExist = job.data?.tokens?.length;

    const params: PutObjectCommandInput = {
      Bucket: this.config.invoicesBucket,
      Key: s3Key,
      Body: buffer,
      ContentType: 'application/pdf',
    };

    params.Metadata = {
      userId,
    };

    if (tokensExist) {
      params.Metadata.tokens = JSON.stringify(job.data.tokens);
    }

    try {
      const command = new PutObjectCommand(params);

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

      console.log(`Here to catch error${e}`);
    }
  }

  @Process('invoice.build.vars')
  async buildInvoice(job: Job) {
    const { dto, params } = job.data;

    await this.generateService.generate(dto, params);
  }
}
