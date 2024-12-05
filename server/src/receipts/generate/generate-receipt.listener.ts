import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Name } from '@libs/enums/queue';
import { QueueClientService } from '@libs/queue-client';
import { AWSConfigService } from '@libs/config';
import { RenderPdf } from '@libs/interfaces/render-pdf';
import { ReceiptPayload, ReceiptVars } from './interfaces';
import { PdfRenderService } from '@libs/pdf-render';
import { AWSClientService } from '@libs/aws-client';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { GenerateReceiptService } from './generate-receipt.service';
import { FirebaseMessage } from '@libs/interfaces/firebase';

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

    const params: PutObjectCommandInput = {
      Bucket: this.config.receiptsBucket,
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
          body: `Something went wrong during the process of report generation.`,
        };

        const messages = tokens.map((token) => {
          const data: FirebaseMessage = {
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
  }

  @Process('receipt.build.vars')
  async generateDevicePDF(job: Job) {
    const { id, params } = job.data;

    await this.generateService.generate(id, params);
  }
}
