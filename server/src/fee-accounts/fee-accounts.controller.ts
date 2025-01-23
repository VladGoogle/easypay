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

import { FeeAccount } from '@libs/entities';
import { CombinedJwtGuard, JwtAdminAccessGuard } from '@libs/guards/jwt';
import { IdDTO } from '@libs/dto';

import { CreateFeeAccountDTO, UpdateFeeAccountDTO } from './dto';
import { FeeAccountsService } from './fee-accounts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Fee Accounts endpoints')
@UseGuards(JwtAdminAccessGuard)
@Controller('fee-accounts')
@ApiBearerAuth()
export class FeeAccountsController {
  constructor(private readonly service: FeeAccountsService) {}

  @UseGuards(CombinedJwtGuard)
  @Get()
  @ApiOkResponse({
    description: 'Returns list of fee accounts',
    type: FeeAccount,
    isArray: true,
  })
  public async index(): Promise<FeeAccount[]> {
    return await this.service.index();
  }

  @UseGuards(CombinedJwtGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns fee account by id',
    type: FeeAccount,
  })
  public getOne(@Param() { id }: IdDTO): Promise<FeeAccount> {
    return this.service.getOne(id);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Post()
  @ApiBody({ type: CreateFeeAccountDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created FeeAccount entity',
    type: FeeAccount,
  })
  public create(@Body() dto: CreateFeeAccountDTO): Promise<FeeAccount> {
    return this.service.create(dto);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateFeeAccountDTO, required: true })
  @ApiOkResponse({
    description: 'Return newly updated FeeAccount entity',
    type: FeeAccount,
  })
  public update(
    @Body() dto: UpdateFeeAccountDTO,
    @Param() { id }: IdDTO,
  ): Promise<FeeAccount> {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted FeeAccount entity',
    type: FeeAccount,
  })
  public delete(@Param() { id }: IdDTO): Promise<FeeAccount> {
    return this.service.delete(id);
  }
}
