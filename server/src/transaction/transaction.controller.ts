import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CombinedJwtGuard,
  JwtAccessGuard,
  JwtAdminAccessGuard,
} from '@libs/guards/jwt';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDTO,
  ListTransactionsDTO,
  ListTransactionsResponseDTO,
  UpdateTransactionDTO,
} from './dto';
import { AuthRequest } from '@libs/interfaces/auth';
import { IdDTO } from '@libs/dto';
import { Transaction } from '@libs/entities';
import { PaginatedList } from '@libs/interfaces/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transaction endpoints')
@Controller('transactions')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(CombinedJwtGuard)
  @Get()
  @ApiOkResponse({
    description: 'Returns list of transactions',
    type: ListTransactionsResponseDTO,
  })
  public index(
    @Query() dto: ListTransactionsDTO,
  ): Promise<PaginatedList<Transaction>> {
    return this.transactionService.index(dto);
  }

  @UseGuards(CombinedJwtGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns transaction by id',
    type: Transaction,
  })
  public getOne(@Param() { id }: IdDTO): Promise<Transaction> {
    return this.transactionService.getOne(id);
  }

  @UseGuards(JwtAccessGuard)
  @Post()
  @ApiBody({ type: CreateTransactionDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created Transaction entity',
    type: Transaction,
  })
  async create(
    @Body() dto: CreateTransactionDTO,
    @Req() { user }: AuthRequest,
  ): Promise<Transaction> {
    return await this.transactionService.create(dto, user);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Patch(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateTransactionDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated Transaction entity',
    type: Transaction,
  })
  async updateStatus(
    @Param() { id }: IdDTO,
    @Body() dto: UpdateTransactionDTO,
  ): Promise<Transaction> {
    return await this.transactionService.updateStatus(id, dto);
  }
}
