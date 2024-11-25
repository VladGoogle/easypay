import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Name } from '@libs/enums/queue';
import { QueueClientService } from '@libs/queue-client';
import { AWSConfigService } from '@libs/config';
import { RenderPdf } from '@libs/interfaces/render-pdf';
import { ReceiptPayload, ReceiptVars } from './interfaces';
import { PdfRenderService } from '@libs/pdf-render';
import { AWSClientService } from '@libs/aws-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { CreateReceipt } from '../interfaces';
import { v7 as uuidv7 } from 'uuid';
import { GenerateReceiptService } from './generate-receipt.service';

@Processor(Name.MessagingHub)
export class GenerateReceiptListener {
  constructor(
    private readonly awsService: AWSClientService,
    private readonly config: AWSConfigService,
    private readonly pdfService: PdfRenderService,
    private readonly generateService: GenerateReceiptService,
    private readonly queue: QueueClientService,
  ) {}

  @Process('receipt.upload')
  async uploadReceipt(job: Job) {
    const { vars, templatePath, s3Key, userId } = job.data as ReceiptPayload;

    const renderPdfPayload: RenderPdf<ReceiptVars> = {
      templatePath,
      vars,
    };

    const buffer = await this.pdfService.renderPdf(renderPdfPayload);

    const tokensExist = job.data?.tokens?.length;

    try {
      const command = new PutObjectCommand({
        Bucket: this.config.receiptsBucket,
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
          body: `Something went wrong during the process of report generation.`,
        };

        const messages = tokens.map((token) =>
          this.queue.messagingHub.add('firebase.send.message', {
            notification,
            message: JSON.stringify(e.stack),
            token,
            id: userId,
          }),
        );

        await Promise.all(messages);
      }

      console.log(e);
    }

    if (tokensExist) {
      const tokens = job.data.tokens;

      const notification = {
        title: 'Alert!',
        body: `Your receipt for the transaction with id = ${vars.transactionDetails.ledgerId} is ready.`,
      };

      const payload = {
        key: s3Key,
      };

      const promises = tokens.map((token) => {
        this.queue.messagingHub.add('firebase.send', {
          notification,
          message: payload,
          token,
          id: userId,
        });
      });

      await Promise.all(promises);
    }

    const receiptDto: CreateReceipt = {
      id: uuidv7(),
      key: s3Key,
      ledgerId: vars.transactionDetails.ledgerId,
    };

    await this.queue.messagingHub.add('receipt.create', {
      dto: receiptDto,
    });
  }

  @Process('receipt.build.vars')
  async generateDevicePDF(job: Job) {
    const { id, params } = job.data;

    await this.generateService.generate(id, params);
  }
}
