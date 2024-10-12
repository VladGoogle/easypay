import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";

import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {pgReturning} from "@libs/utils";

import {FeeRules} from "@libs/entities/fee-rules.entity";
import {CreateFeeRuleDTO, UpdateFeeRuleDTO} from "../dto";
import {isObject} from "lodash";
import {FeeAccount, User} from "@libs/entities";

@Injectable()
export class FeeRulesRepository implements RepositoryInterface {

    constructor(@InjectRepository(FeeRules) private readonly repository: Repository<FeeRules>) {
    }

    async getOne(data: GetOne<any>): Promise<FeeRules | never> {

        const builder = this.repository.createQueryBuilder('f')


        let filterPayload: FindOptionsWhere<User>

        if(isObject(data.filter)) {
            filterPayload = {...data.filter} as FindOptionsWhere<User>
        } else {
            filterPayload = {
                id: data.filter
            }
        }

        const where: FindOptionsWhere<FeeAccount> = filterPayload;

        if(data?.runner) {
            builder
                .setQueryRunner(data.runner)
                .useTransaction(true)
                .setLock('pessimistic_write');
        }

        try {
            const res = await builder.where(where).getOne();

            if (!res) {
                throw new NotFoundException('Fee rules not found');
            }

            return res
        } catch (e) {
            throw e
        }
    }

    public async index(): Promise<FeeRules[] | never> {

        try {
            const builder = this.repository.createQueryBuilder('f')
            return await builder.where({}).getMany()
        } catch (e) {
            throw e
        }
    }

    public async create(dto:  CreateFeeRuleDTO): Promise<FeeRules | never> {
        try {
            const item = this.repository.create(dto);

            await this.repository.save(item);

           return item
        } catch (e: any) {

            if (e?.code === '23505') {
                throw new BadRequestException('Fee rule already exists');
            } else {
                throw e
            }

        }
    }

    public async update(id: string, dto: UpdateFeeRuleDTO): Promise<FeeRules | never> {

        const where: FindOptionsWhere<FeeRules> = {id}

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {

            const data: GetOne<any> = {
                filter: id,
                runner
            }

            const item = await this.getOne(data);

            const { raw: result } = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .update()
                .where(where)
                .set(dto)
                .returning(pgReturning(this.repository))
                .execute();

            const [returned] = result as [FeeRules];

            if (!returned) {
                throw new NotFoundException('Fee rules not found');
            }

            return this.repository.merge(item, returned);
        } catch (e: any) {
            if(e.code === 404) {
                throw new NotFoundException('Fee rules not found');
            }

            throw e
        }
    }

    public async delete(id: string): Promise<FeeRules | never> {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const where: FindOptionsWhere<FeeRules> = {id};

            const item = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .setLock('pessimistic_write')
                .where(where)
                .getOne();

            if (!item) {
                throw new NotFoundException('Fee rule not found');
            }

            const {
                raw: [returned],
            } = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .softDelete()
                .from(FeeRules)
                .where(where)
                .returning(pgReturning(this.repository))
                .execute();

            await runner.commitTransaction();

            return this.repository.merge(item, returned);
        } catch (e) {
            await runner.rollbackTransaction();
            throw e
        } finally {
            await runner.release();
        }
    }


}
