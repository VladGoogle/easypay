import {Inject, Injectable} from '@nestjs/common';
import {isEmpty} from "lodash";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

import {FeeAccount} from "@libs/entities";
import {BodyIsEmptyException, ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";

import {FEE_ACCOUNT_REPOSITORY_TOKEN} from "./constants";
import {CreateFeeAccountDTO, UpdateFeeAccountDTO} from "./dto";

@Injectable()
export class FeeAccountsService {

    constructor(@Inject(FEE_ACCOUNT_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<FeeAccount> {

        const filter: FindOptionsWhere<FeeAccount> = {
            id
        }

        const data: GetOne<FindOptionsWhere<FeeAccount>> = {
            filter
        }

        const res = await this.repository.getOne(data)

        if (!res) {
            throw new ByIdNotFoundException(FeeAccount, id);
        }

        return res
    }

    public async index(): Promise<FeeAccount[]> {
        return await this.repository.index()
    }

    public async create(dto: CreateFeeAccountDTO): Promise<FeeAccount> {

        const data: DeepPartial<FeeAccount> = {
            ...dto,
            id: uuidv7(),
        };

        return this.repository.create(data)
    }

    public async update(id: string, dto: UpdateFeeAccountDTO): Promise<FeeAccount> {

        const where: FindOptionsWhere<FeeAccount> = {id}
        const update: Partial<FeeAccount> = dto;

        if (isEmpty(update)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(where, update)
    }

    public async delete(id: string): Promise<FeeAccount> {
        return this.repository.delete(id)
    }
}
