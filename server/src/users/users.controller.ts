import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { IdDTO } from '@libs/dto';
import { User } from '@libs/entities';

import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UsersService } from './users.service';
import {
  CombinedJwtGuard,
  JwtAccessGuard,
  JwtAdminAccessGuard,
} from '@libs/guards/jwt';
import { FindOptionsWhere } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAdminAccessGuard)
  @Get()
  public async index(): Promise<User[]> {
    return await this.service.index();
  }

  @UseGuards(CombinedJwtGuard)
  @Get(':id')
  public getOne(@Param() { id }: IdDTO): Promise<User> {
    const where: FindOptionsWhere<User> = {
      id,
    };

    return this.service.getOne(where);
  }

  @Post()
  public create(@Body() dto: CreateUserDTO): Promise<Omit<User, 'password'>> {
    return this.service.create(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  public update(
    @Param() { id }: IdDTO,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  public delete(@Param() { id }: IdDTO): Promise<User> {
    return this.service.delete(id);
  }
}
