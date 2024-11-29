import { Module } from '@nestjs/common';

import { AWSClientService } from './aws-client.service';
import { AWSConfigModule } from '@libs/config';

@Module({
  imports: [AWSConfigModule],
  providers: [AWSClientService],
  exports: [AWSClientService],
})
export class AWSClientModule {}
