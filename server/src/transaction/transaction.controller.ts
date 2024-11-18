import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard, JwtAdminAccessGuard } from '@libs/guards/jwt';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO, UpdateTransactionDTO } from './dto';
import { AuthRequest } from '@libs/interfaces/auth';
import { IdDTO } from '@libs/dto';
import { Transaction } from '@libs/entities';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAccessGuard, JwtAdminAccessGuard)
  @Get(':id')
  public getOne(@Param() { id }: IdDTO): Promise<Transaction> {
    return this.transactionService.getOne(id);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  async create(
    @Body() dto: CreateTransactionDTO,
    @Req() { user }: AuthRequest,
  ): Promise<Transaction> {
    return await this.transactionService.create(dto, user);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Patch(':id')
  async updateStatus(
    @Param() { id }: IdDTO,
    @Body() dto: UpdateTransactionDTO,
  ): Promise<Transaction> {
    return await this.transactionService.updateStatus(id, dto);
  }
}
