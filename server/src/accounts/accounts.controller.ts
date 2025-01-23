import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { IdDTO } from '@libs/dto';
import { PaymentAccount } from '@libs/entities';
import { CombinedJwtGuard, JwtAccessGuard } from '@libs/guards/jwt';
import { AuthRequest } from '@libs/interfaces/auth';

import { AccountsService } from './accounts.service';
import {
  AddFundsDTO,
  CreateAccountDTO,
  GetOneAccountDTO,
  ListAccountsDTO,
  ListResponseDTO,
  UpdateAccountDTO,
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

@ApiTags('Accounts endpoints')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @UseGuards(CombinedJwtGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns list of payment accounts',
    type: ListResponseDTO,
  })
  public async index(
    @Query() dto: ListAccountsDTO,
  ): Promise<PaginatedList<PaymentAccount>> {
    return await this.service.index(dto);
  }

  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns payment account by id',
    type: PaymentAccount,
  })
  @Get(':id')
  public getOne(
    @Param() { id }: IdDTO,
    @Query() dto: GetOneAccountDTO,
  ): Promise<PaymentAccount> {
    return this.service.getOne(id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateAccountDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created PaymentAccount entity',
    type: PaymentAccount,
  })
  public create(
    @Body() dto: CreateAccountDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaymentAccount> {
    return this.service.create(dto, user);
  }

  @UseGuards(CombinedJwtGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateAccountDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated PaymentAccount entity',
    type: PaymentAccount,
  })
  public update(
    @Body() dto: UpdateAccountDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.update(id, dto);
  }

  @Patch(':id/add-funds')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: AddFundsDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated PaymentAccount entity',
    type: PaymentAccount,
  })
  public addFunds(
    @Body() dto: AddFundsDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.addFunds(id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted PaymentAccount entity',
    type: PaymentAccount,
  })
  public delete(
    @Param() { id }: IdDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaymentAccount> {
    return this.service.delete(id, user);
  }
}
