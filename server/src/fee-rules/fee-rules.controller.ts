import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateFeeRuleDTO, UpdateFeeRuleDTO } from './dto';
import { FeeRulesService } from './fee-rules.service';
import { FeeRules } from '@libs/entities/fee-rules.entity';
import { CombinedJwtGuard, JwtAdminAccessGuard } from '@libs/guards/jwt';
import { IdDTO } from '@libs/dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Fee Rules endpoints')
@Controller('fee-rules')
@ApiBearerAuth()
export class FeeRulesController {
  constructor(private readonly service: FeeRulesService) {}

  @UseGuards(JwtAdminAccessGuard)
  @Get()
  @ApiOkResponse({
    description: 'Returns list of fee rules',
    type: FeeRules,
    isArray: true,
  })
  public async index(): Promise<FeeRules[]> {
    return await this.service.index();
  }

  @UseGuards(CombinedJwtGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns fee rule by id',
    type: FeeRules,
  })
  public getOne(@Param() { id }: IdDTO): Promise<FeeRules> {
    return this.service.getOne(id);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Post()
  @ApiBody({ type: CreateFeeRuleDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created FeeRule entity',
    type: FeeRules,
  })
  public create(@Body() dto: CreateFeeRuleDTO): Promise<FeeRules> {
    return this.service.create(dto);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Post(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateFeeRuleDTO, required: true })
  @ApiOkResponse({
    description: 'Return newly updated FeeRule entity',
    type: FeeRules,
  })
  public update(
    @Body() dto: UpdateFeeRuleDTO,
    @Param() { id }: IdDTO,
  ): Promise<FeeRules> {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAdminAccessGuard)
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted FeeRule entity',
    type: FeeRules,
  })
  public delete(@Param() { id }: IdDTO): Promise<FeeRules> {
    return this.service.delete(id);
  }
}
