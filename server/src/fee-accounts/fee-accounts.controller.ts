import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';

import {FeeAccount} from "@libs/entities";
import {JwtAdminAccessGuard} from "@libs/guards/jwt";
import {IdDTO} from "@libs/dto";

import {CreateFeeAccountDTO, UpdateFeeAccountDTO} from "./dto";
import {FeeAccountsService} from "./fee-accounts.service";

@UseGuards(JwtAdminAccessGuard)
@Controller('fee-accounts')
export class FeeAccountsController {

    constructor(private readonly service: FeeAccountsService) {}

    @Get()
    public async index(): Promise<FeeAccount[]> {
        return await this.service.index();
    }

    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
    ): Promise<FeeAccount> {
        return this.service.getOne(id);
    }

    @Post()
    public create(
        @Body() dto: CreateFeeAccountDTO,
    ): Promise<FeeAccount> {
        return this.service.create(dto);
    }

    @Patch(':id')
    public update(
        @Body() dto: UpdateFeeAccountDTO,
        @Param() { id }: IdDTO,
    ): Promise<FeeAccount> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO,
    ): Promise<FeeAccount> {
        return this.service.delete(id);
    }

}
