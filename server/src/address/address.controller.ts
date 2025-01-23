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
import { Address } from '@libs/entities';
import { IdDTO } from '@libs/dto';
import { AddressService } from './address.service';
import { CreateAddressDTO, UpdateAddressDTO } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAccessGuard } from '@libs/guards/jwt';

@ApiTags('Address endpoints')
@Controller('addresses')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns list of addresses',
    type: Address,
    isArray: true,
  })
  public async index(): Promise<Address[]> {
    return await this.service.index();
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns address by id',
    type: Address,
  })
  public getOne(@Param() { id }: IdDTO): Promise<Address> {
    return this.service.getOne(id);
  }

  @Post()
  @ApiBody({ type: CreateAddressDTO, required: true })
  @ApiCreatedResponse({
    description: 'Returns newly created address',
    type: Address,
  })
  public create(@Body() dto: CreateAddressDTO): Promise<Address> {
    return this.service.create(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateAddressDTO, required: true })
  @ApiOkResponse({
    description: 'Returns newly updated Address entity',
    type: Address,
  })
  public update(
    @Body() dto: UpdateAddressDTO,
    @Param() { id }: IdDTO,
  ): Promise<Address> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted Address entity',
    type: Address,
  })
  public delete(@Param() { id }: IdDTO): Promise<Address> {
    return this.service.delete(id);
  }
}
