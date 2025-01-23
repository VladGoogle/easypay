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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User endpoints')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAdminAccessGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns list of users',
    type: User,
    isArray: true,
  })
  public async index(): Promise<User[]> {
    return await this.service.index();
  }

  @UseGuards(CombinedJwtGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns user by id',
    type: User,
  })
  public getOne(@Param() { id }: IdDTO): Promise<User> {
    const where: FindOptionsWhere<User> = {
      id,
    };

    return this.service.getOne(where);
  }

  @Post()
  @ApiBody({ type: CreateUserDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly created User entity',
    type: User,
  })
  public create(@Body() dto: CreateUserDTO): Promise<Omit<User, 'password'>> {
    return this.service.create(dto);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateUserDTO, required: true })
  @ApiCreatedResponse({
    description: 'Return newly updated User entity',
    type: User,
  })
  public update(
    @Param() { id }: IdDTO,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted User entity',
    type: User,
  })
  public delete(@Param() { id }: IdDTO): Promise<User> {
    return this.service.delete(id);
  }
}
