import {Body, Controller, Delete, Get, Param, Patch, Post, Req} from '@nestjs/common';
import {AuthRequest} from "@libs/interfaces/auth";
import {Address, Country} from "@libs/entities";
import {IdDTO} from "@libs/dto";
import {AddressService} from "./address.service";
import {CreateAddressDTO, UpdateAddressDTO} from "./dto";

@Controller('addresses')
export class AddressController {

    constructor(private readonly service: AddressService) {
    }

    @Get()
    public async index(
        // @Query() dto: ListDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Address[]> {
        return await this.service.index();
    }

    @Get(':id')
    public getOne(
        @Param() { id }: IdDTO,
        // @Query() dto: GetOneDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Address> {
        return this.service.getOne(id);
    }

    @Post()
    public create(
        @Body() dto: CreateAddressDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Address> {
        return this.service.create(dto);
    }

    @Patch(':id')
    public update(
        @Body() dto: UpdateAddressDTO,
        @Param() { id }: IdDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Address> {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    public delete(
        @Param() { id }: IdDTO,
        @Req() { user }: AuthRequest,
    ): Promise<Address> {
        return this.service.delete(id);
    }
}
