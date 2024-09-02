import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Country} from "@libs/entities";
import {CountryService} from "./country.service";
import {COUNTRY_REPOSITORY_TOKEN} from "./constants";
import {CountryRepository} from "./repositories";
import {CountryController} from "./country.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Country])],
    providers: [
        CountryService,
        {
            provide: COUNTRY_REPOSITORY_TOKEN,
            useClass: CountryRepository,
        },
    ],
    controllers: [CountryController]
})
export class CountryModule {}
