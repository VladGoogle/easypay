import {Inject, Injectable} from '@nestjs/common';
import {RepositoryInterface} from "@libs/interfaces/repository";
import {Address, Country} from "@libs/entities";
import {isEmpty} from "lodash";
import {BodyIsEmptyException} from "@libs/exceptions";
import {ADDRESS_REPOSITORY_TOKEN} from "./constants";
import {CreateAddressDTO, UpdateAddressDTO} from "./dto";
import {DeepPartial} from "typeorm";
import {v7 as uuidv7} from "uuid";


@Injectable()
export class AddressService {

    constructor(@Inject(ADDRESS_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<Address> {
        return this.repository.getOne(id)
    }

    public async index(): Promise<Address[]> {
        return this.repository.index()
    }

    public async create(dto: CreateAddressDTO): Promise<Address> {

        const data: DeepPartial<Address> = {
            ...dto,
            id: uuidv7(),
        };

        return this.repository.create(data)
    }

    public async update(id: string, dto: UpdateAddressDTO): Promise<Address> {

        const updateQuery: Partial<Address> = dto;

        if (isEmpty(updateQuery)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(id, updateQuery)
    }

    public async delete(id: string): Promise<Address> {
        return this.repository.delete(id)
    }
}
