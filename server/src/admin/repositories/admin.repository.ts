import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {isObject} from "lodash";
import {FindOptionsWhere, Repository} from "typeorm";

import {Admin, User} from "@libs/entities";
import {ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {QueueClientService} from "@libs/queue-client";
import {pgReturning} from "@libs/utils";

import {CreateAdminDTO} from "../dto";

@Injectable()
export class AdminRepository implements RepositoryInterface {

    constructor(@InjectRepository(Admin) private readonly repository: Repository<Admin>,
                private readonly queue: QueueClientService) {
    }

    async getOne<T>(data: GetOne<any>) {

        const builder = this.repository.createQueryBuilder('a')

        let filterPayload

        if(isObject(data.filter)) {
            filterPayload = {...data.filter} as FindOptionsWhere<User>
        } else {
            filterPayload = data.filter as FindOptionsWhere<User>
        }

        const where: FindOptionsWhere<Admin> = filterPayload;

        if(data?.runner) {
            builder
                .setQueryRunner(data.runner)
                .useTransaction(true)
                .setLock('pessimistic_write');
        }

        if(data?.select?.length) {
            for(let field of data.select) {
                builder.addSelect(`a.${field}`)
            }
        }

        try {
            return await builder.where(where).getOne()
        } catch (e) {
            throw e
        }
    }

    public async index(): Promise<Admin[] | never> {
        try {
            const builder = this.repository.createQueryBuilder('a')
            return await builder.where({}).getMany()
        } catch (e) {
            throw e
        }
    }

    public async create(dto: CreateAdminDTO): Promise<Admin | never> {

        try {
            const item = this.repository.create(dto);

            await this.repository.save(item);

            const {email, id} = item

            await this.queue.messagingHub.add('stripe.customer.create', {
                email,
                id,
            });

           return item
        } catch (e) {
            throw e
        }
    }

    public async update(where: FindOptionsWhere<Admin>, dto: Partial<Admin>) {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {

            const getOnePayload: GetOne<any> = {
                filter: where,
                runner
            }

            const item = await this.getOne(getOnePayload) as Admin

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

            const [returned] = result as [Admin];

            if (!returned) {
                throw new NotFoundException('Admin not found');
            }

            return this.repository.merge(item, returned);
        } catch (e: any) {
            await runner.rollbackTransaction();
            throw e
        } finally {
            await runner.release();
        }
    }

    public async delete(id: string): Promise<Admin | never> {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const where: FindOptionsWhere<Admin> = {id};

            const item = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .setLock('pessimistic_write')
                .where(where)
                .getOne();

            if (!item) {
                throw new ByIdNotFoundException(Admin, id);
            }

            const {
                raw: [returned],
            } = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .softDelete()
                .from(User)
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
