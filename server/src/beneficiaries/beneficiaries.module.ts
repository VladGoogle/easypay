import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Beneficiary } from '@libs/entities';

import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesListener } from './beneficiaries.listener';
import { BeneficiariesService } from './beneficiaries.service';
import { ElasticModule } from '../elastic';

@Module({
  imports: [TypeOrmModule.forFeature([Beneficiary]), ElasticModule],
  providers: [BeneficiariesService, BeneficiariesListener],
  controllers: [BeneficiariesController],
})
export class BeneficiariesModule {}
