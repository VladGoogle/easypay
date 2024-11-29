import { Injectable, OnModuleInit } from '@nestjs/common';
import { AWSConfigService } from '@libs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';

@Injectable()
export class AWSClientService implements OnModuleInit {
  public s3Client: S3Client;

  public s3: S3;

  constructor(private readonly config: AWSConfigService) {}

  onModuleInit(): any {
    this.s3Client = new S3Client({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      forcePathStyle: true,
    });

    this.s3 = new S3({
      region: this.config.region,
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      s3ForcePathStyle: true,
    });

    console.log('AWS has been loaded successfully');
  }
}
