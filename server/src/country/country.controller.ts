import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Country } from '@libs/entities';
import { IdDTO, ListDTO } from '@libs/dto';
import { Jwt2faAccessGuard } from '@libs/guards/jwt';

import { CountryService } from './country.service';
import { CreateCountryDTO, UpdateCountryDTO } from './dto';
import { PaginatedList } from '@libs/interfaces/common';

@Controller('countries')
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
  public async index(@Query() dto: ListDTO): Promise<PaginatedList<Country>> {
    return await this.service.index(dto);
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
