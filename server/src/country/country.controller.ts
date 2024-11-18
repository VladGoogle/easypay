import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Country } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import { Jwt2faAccessGuard } from '@libs/guards/jwt';

import { CountryService } from './country.service';
import { CreateCountryDTO, UpdateCountryDTO } from './dto';

@Controller('countries')
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
  public async index(): Promise<Country[]> {
    return await this.service.index();
  }

  @Get(':id')
  public getOne(@Param() { id }: IdDTO): Promise<Country> {
    return this.service.getOne(id);
  }

  @Post()
  public create(@Body() dto: CreateCountryDTO): Promise<Country> {
    return this.service.create(dto);
  }

  @UseGuards(Jwt2faAccessGuard)
  @Patch(':id')
  public update(
    @Body() dto: UpdateCountryDTO,
    @Param() { id }: IdDTO,
  ): Promise<Country> {
    return this.service.update(id, dto);
  }

  @UseGuards(Jwt2faAccessGuard)
  @Delete(':id')
  public delete(@Param() { id }: IdDTO): Promise<Country> {
    return this.service.delete(id);
  }
}
