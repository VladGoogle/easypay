import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';

import {IdDTO} from "@libs/dto";
import {Admin} from "@libs/entities";
import {JwtAdminAccessGuard} from "@libs/guards/jwt";

import {AdminService} from "./admin.service";
import {CreateAdminDTO, UpdateAdminDTO} from "./dto";

@UseGuards(JwtAdminAccessGuard)
@Controller('admins')
export class AdminController {

    constructor(private readonly service: AdminService) {
    }

    @Get()
    public async index(): Promise<Admin[]> {
        return await this.service.index();
    }

    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
    ): Promise<Admin> {
        return this.service.getOne(id);
    }

    @Post()
    public create(
        @Body() dto: CreateAdminDTO,
    ): Promise<Omit<Admin, 'password'>> {
        return this.service.create(dto);
    }

    @Patch(':id')
    public update(
        @Body() dto: UpdateAdminDTO,
        @Param() { id }: IdDTO,
    ): Promise<Admin> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO,
    ): Promise<Admin> {
        return this.service.delete(id);
    }
}
