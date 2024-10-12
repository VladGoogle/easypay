import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {CreateFeeRuleDTO, UpdateFeeRuleDTO} from "./dto";
import {FeeRulesService} from "./fee-rules.service";
import {FeeRules} from "@libs/entities/fee-rules.entity";
import {JwtAccessGuard, JwtAdminAccessGuard} from "@libs/guards/jwt";
import {IdDTO} from "@libs/dto";

@Controller('fee-rules')
export class FeeRulesController {

    constructor(private readonly service: FeeRulesService) {}

    @UseGuards(JwtAccessGuard, JwtAdminAccessGuard)
    @Get()
    public async index(
    ): Promise<FeeRules[]> {
        return await this.service.index();
    }

    @UseGuards(JwtAccessGuard, JwtAdminAccessGuard)
    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
    ): Promise<FeeRules> {
        return this.service.getOne(id);
    }

    @UseGuards(JwtAdminAccessGuard)
    @Post()
    public create(
        @Body() dto: CreateFeeRuleDTO,
    ): Promise<FeeRules> {
        return this.service.create(dto);
    }

    @UseGuards(JwtAdminAccessGuard)
    @Post(':id')
    public update(
        @Body() dto: UpdateFeeRuleDTO,
        @Param() { id }: IdDTO,
    ): Promise<FeeRules> {
        return this.service.update(id, dto);
    }

    @UseGuards(JwtAdminAccessGuard)
    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO,
    ): Promise<FeeRules> {
        return this.service.delete(id);
    }

}
