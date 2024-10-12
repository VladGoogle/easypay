import {Inject, Injectable} from '@nestjs/common';
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {isEmpty} from "lodash";
import {BodyIsEmptyException} from "@libs/exceptions";
import {FEE_RULES_REPOSITORY_TOKEN} from "./constants";
import {CreateFeeRuleDTO, UpdateFeeRuleDTO} from "./dto";
import {FeeRules} from "@libs/entities/fee-rules.entity";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

@Injectable()
export class FeeRulesService {

    constructor(@Inject(FEE_RULES_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<FeeRules> {

        const filter: FindOptionsWhere<FeeRules> = {
            id
        }

        const data: GetOne<FindOptionsWhere<FeeRules>> = {
            filter
        }

        return this.repository.getOne(data)
    }

    public async index(): Promise<FeeRules[]> {
        return this.repository.index()
    }

    public async create(dto: CreateFeeRuleDTO): Promise<FeeRules> {

        const data: DeepPartial<FeeRules> = {
            ...dto,
            id: uuidv7(),
        };

        return this.repository.create(data)
    }

    public async update(id: string, dto: UpdateFeeRuleDTO): Promise<FeeRules> {

        const updateQuery: Partial<FeeRules> = dto;

        if (isEmpty(updateQuery)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(id, updateQuery)
    }

    public async delete(id: string): Promise<FeeRules> {
        return this.repository.delete(id)
    }
}
