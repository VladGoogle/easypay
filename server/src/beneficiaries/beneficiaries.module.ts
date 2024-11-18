import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Beneficiary } from '@libs/entities';

import { BeneficiariesController } from './beneficiaries.controller';
import { BeneficiariesListener } from './beneficiaries.listener';
import { BeneficiariesService } from './beneficiaries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Beneficiary])],
  providers: [BeneficiariesService, BeneficiariesListener],
  controllers: [BeneficiariesController],
})
export class BeneficiariesModule {}
