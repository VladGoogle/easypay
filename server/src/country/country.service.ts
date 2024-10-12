import {Inject, Injectable} from '@nestjs/common';
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {Country} from "@libs/entities";
import {isEmpty} from "lodash";
import {BodyIsEmptyException} from "@libs/exceptions";
import {COUNTRY_REPOSITORY_TOKEN} from "./constants";
import {CreateCountryDTO, UpdateCountryDTO} from "./dto";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

@Injectable()
export class CountryService {

    constructor(@Inject(COUNTRY_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<Country> {

        const filter: FindOptionsWhere<Country> = {
            id
        }

        const data: GetOne<FindOptionsWhere<Country>> = {
            filter
        }

        return this.repository.getOne(data)
    }

    public async index(): Promise<Country[]> {
        return this.repository.index()
    }

    public async create(dto: CreateCountryDTO): Promise<Country> {

        const data: DeepPartial<Country> = {
            ...dto,
            id: uuidv7(),
        };

        return this.repository.create(data)
    }

    public async update(id: string, dto: UpdateCountryDTO): Promise<Country> {

        const updateQuery: Partial<Country> = dto;

        if (isEmpty(updateQuery)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(id, updateQuery)
    }

    public async delete(id: string): Promise<Country> {
        return this.repository.delete(id)
    }
}
