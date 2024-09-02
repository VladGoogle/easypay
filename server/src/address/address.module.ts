import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Address} from "@libs/entities";
import {ADDRESS_REPOSITORY_TOKEN} from "./constants";
import {AddressRepository} from "./repositories";

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [
    AddressService,
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: AddressRepository,
    },
  ],
  controllers: [AddressController]
})
export class AddressModule {}
