import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';

import {IdDTO} from "@libs/dto";
import {User} from "@libs/entities";

import {CreateUserDTO, UpdateUserDTO} from "./dto";
import {UsersService} from "./users.service";

@Controller('users')
export class UsersController {

    constructor(private readonly service: UsersService) {
    }

    @Get()
    public async index(): Promise<User[]> {
        return await this.service.index();
    }

    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
    ): Promise<User> {
        return this.service.getOne(id);
    }

    @Post()
    public create(
        @Body() dto: CreateUserDTO,
    ): Promise<Omit<User, 'password'>> {
        return this.service.create(dto);
    }

    @Patch(':id')
    public update(
        @Param() { id }: IdDTO,
        @Body() dto: UpdateUserDTO
    ): Promise<User> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO
    ): Promise<User> {
        return this.service.delete(id);
    }
}
