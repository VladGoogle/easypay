import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {ADMIN_REPOSITORY_TOKEN} from "@libs/constants";
import {Admin} from "@libs/entities";

import {AdminController} from "./admin.controller";
import {AdminService} from "./admin.service";
import {AdminRepository} from "./repositories";

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
  ],
  providers: [
    AdminService,
    {
      provide: ADMIN_REPOSITORY_TOKEN,
      useClass: AdminRepository,
    },
  ],
  controllers: [AdminController],
  exports: [
    {
      provide: ADMIN_REPOSITORY_TOKEN,
      useClass: AdminRepository,
    }
  ]
})
export class AdminModule {}
