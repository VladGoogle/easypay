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

import { Country, PaymentAccount } from '@libs/entities';
import { IdDTO, ListDTO } from '@libs/dto';
import { Jwt2faAccessGuard } from '@libs/guards/jwt';

import { CountryService } from './country.service';
import {
  CreateCountryDTO,
  ListCountriesResponseDTO,
  UpdateCountryDTO,
} from './dto';
import { PaginatedList } from '@libs/interfaces/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Country endpoints')
@Controller('countries')
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns list of countries',
    type: ListCountriesResponseDTO,
  })
  public async index(@Query() dto: ListDTO): Promise<PaginatedList<Country>> {
    return await this.service.index(dto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns country by id',
    type: Country,
  })
  public getOne(@Param() { id }: IdDTO): Promise<Country> {
    return this.service.getOne(id);
  }

  @Post()
  @ApiBody({ type: CreateCountryDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created Country entity',
    type: Country,
  })
  public create(@Body() dto: CreateCountryDTO): Promise<Country> {
    return this.service.create(dto);
  }

  @UseGuards(Jwt2faAccessGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateCountryDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated Country entity',
    type: PaymentAccount,
  })
  public update(
    @Body() dto: UpdateCountryDTO,
    @Param() { id }: IdDTO,
  ): Promise<Country> {
    return this.service.update(id, dto);
  }

  @UseGuards(Jwt2faAccessGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiCreatedResponse({
    description: 'Return newly deleted Country entity',
    type: Country,
  })
  public delete(@Param() { id }: IdDTO): Promise<Country> {
    return this.service.delete(id);
  }
}
