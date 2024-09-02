import {Body, Controller, Delete, Get, Param, Patch, Post, Req} from '@nestjs/common';

import {IdDTO} from "@libs/dto";
import {User} from "@libs/entities";
import {AuthRequest} from "@libs/interfaces/auth";

import {CreateUserDTO, UpdateUserDTO} from "./dto";
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) {
    }

    @Get()
    public async index(
        // @Query() dto: ListDTO,
        @Req() { user }: AuthRequest,
    ): Promise<User[]> {
        return await this.service.index();
    }

    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
        // @Query() dto: GetOneDTO,
        @Req() { user }: AuthRequest,
    ): Promise<User> {
        return this.service.getOne(id);
    }

    @Post()
    public create(
        @Body() dto: CreateUserDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Omit<User, 'password'>> {
        return this.service.create(dto);
    }

    @Patch(':id')
    public update(
        @Body() dto: UpdateUserDTO,
        @Param() { id }: IdDTO,
        @Req() { user }: AuthRequest,
    ): Promise<User> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO,
        @Req() { user }: AuthRequest,
    ): Promise<User> {
        return this.service.delete(id);
    }
}
