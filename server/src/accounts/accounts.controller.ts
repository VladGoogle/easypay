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
import { Admin, PaymentAccount, User } from '@libs/entities';
import { JwtAccessGuard, JwtAdminAccessGuard } from '@libs/guards/jwt';
import { AuthRequest } from '@libs/interfaces/auth';

import { AccountsService } from './accounts.service';
import {
  AddFundsDTO,
  CreateAccountDTO,
  ListAccountsDTO,
  UpdateAccountDTO,
} from './dto';
import { PaginatedList } from '@libs/interfaces/common';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @UseGuards(JwtAccessGuard)
  @Get()
  public async index(
    @Query() dto: ListAccountsDTO,
  ): Promise<PaginatedList<PaymentAccount>> {
    return await this.service.index(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  public getOne(@Param() { id }: IdDTO): Promise<PaymentAccount> {
    return this.service.getOne(id);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  public create(
    @Body() dto: CreateAccountDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaymentAccount> {
    return this.service.create(dto, user);
  }

  @UseGuards(JwtAccessGuard, JwtAdminAccessGuard)
  @Patch(':id')
  public update(
    @Body() dto: UpdateAccountDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.update(id, dto);
  }

  @Patch(':id/add-funds')
  public addFunds(
    @Body() dto: AddFundsDTO,
    @Param() { id }: IdDTO,
  ): Promise<PaymentAccount> {
    return this.service.addFunds(id, dto);
  }

  @Delete(':id')
  public delete(
    @Param() { id }: IdDTO,
    @Req() { user }: AuthRequest,
  ): Promise<PaymentAccount> {
    return this.service.delete(id, user);
  }
}
