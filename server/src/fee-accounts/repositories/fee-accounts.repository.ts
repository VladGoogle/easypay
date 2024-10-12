import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {isObject} from "lodash";
import {FindOptionsWhere, Repository} from "typeorm";

import {FeeAccount, User} from "@libs/entities";
import {ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {pgReturning} from "@libs/utils";

import {CreateFeeAccountDTO} from "../dto";

@Injectable()
export class FeeAccountsRepository implements RepositoryInterface {

    constructor(@InjectRepository(FeeAccount) private readonly repository: Repository<FeeAccount>) {
    }

    async getOne<T>(data: GetOne<any>) {

        const builder = this.repository.createQueryBuilder('f')

        let filterPayload

        if(isObject(data.filter)) {
            filterPayload = {...data.filter} as FindOptionsWhere<User>
        } else {
            filterPayload = data.filter as FindOptionsWhere<User>
        }

        const where: FindOptionsWhere<FeeAccount> = filterPayload;

        if(data?.runner) {
            builder
                .setQueryRunner(data.runner)
                .useTransaction(true)
                .setLock('pessimistic_write');
        }

        try {
            return await builder.where(where).getOne()
        } catch (e) {
            throw e;
        }

    }

    public async index(): Promise<FeeAccount[] | never> {

        try {
            const builder = this.repository.createQueryBuilder('f')
            return await builder.where({}).getMany()
        } catch (e) {
            throw e
        }
    }

    public async create(dto: CreateFeeAccountDTO): Promise<FeeAccount | never> {

        try {
            const item = this.repository.create(dto);

            await this.repository.save(item);

           return item
        } catch (e: any) {

            if (e?.code === '23505') {
                throw new BadRequestException('Fee account with such currency already exists');
            } else {
                throw e
            }
        }
    }

    public async update(where: FindOptionsWhere<FeeAccount>, dto: Partial<FeeAccount>) {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const getOnePayload: GetOne<any> = {
                filter: where,
                runner
            }

            const item = await this.getOne(getOnePayload);

            const { raw: result } = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .update()
                .where(where)
                .set(dto)
                .returning(pgReturning(this.repository))
                .execute();

            await runner.commitTransaction();

            const [returned] = result as [User];

            if (!returned) {
                throw new NotFoundException('Fee account not found');
            }

            return this.repository.merge(<FeeAccount>item, returned);
        } catch (e: any) {
            await runner.rollbackTransaction();
            if (e?.code === '23505') {
                throw new BadRequestException('Fee account with such currency already exists');
            } else {
                throw e
            }
        } finally {
            await runner.release();
        }
    }

    public async delete(id: string): Promise<FeeAccount | never> {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const where: FindOptionsWhere<FeeAccount> = {id};

            const item = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .setLock('pessimistic_write')
                .where(where)
                .getOne();

            if (!item) {
                throw new ByIdNotFoundException(FeeAccount, id);
            }

            const {
                raw: [returned],
            } = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .softDelete()
                .from(FeeAccount)
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
