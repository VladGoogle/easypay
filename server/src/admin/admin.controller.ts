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
import { Admin } from '@libs/entities';
import { JwtAdminAccessGuard } from '@libs/guards/jwt';

import { AdminService } from './admin.service';
import { CreateAdminDTO, UpdateAdminDTO } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin endpoints')
@UseGuards(JwtAdminAccessGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns the list of admins',
    type: Admin,
    isArray: true,
  })
  public async index(): Promise<Admin[]> {
    return await this.service.index();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Returns admin by id',
    type: Admin,
  })
  public getOne(@Param() { id }: IdDTO): Promise<Admin> {
    return this.service.getOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateAdminDTO, required: true })
  @ApiOkResponse({
    description: 'The response with access and refresh tokens',
    type: Admin,
  })
  public create(@Body() dto: CreateAdminDTO): Promise<Omit<Admin, 'password'>> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: UpdateAdminDTO, required: true })
  @ApiOkResponse({
    description: 'Returns newly updated Admin entity',
    type: Admin,
  })
  public update(
    @Body() dto: UpdateAdminDTO,
    @Param() { id }: IdDTO,
  ): Promise<Admin> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiOkResponse({
    description: 'Return newly deleted Admin entity',
    type: Admin,
  })
  public delete(@Param() { id }: IdDTO): Promise<Admin> {
    return this.service.delete(id);
  }
}
