import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, Repository} from "typeorm";

import {User} from "@libs/entities";
import {ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {QueueClientService} from "@libs/queue-client";
import {pgReturning} from "@libs/utils";

import {CreateUserDTO} from "../dto";

@Injectable()
export class UsersRepository implements RepositoryInterface {

    constructor(@InjectRepository(User) private readonly repository: Repository<User>,
                private readonly queue: QueueClientService) {
    }

    async getOne<T>(data: GetOne<any>) {

        const builder = this.repository.createQueryBuilder('u')

        const where: FindOptionsWhere<User> = data.filter;

        if(data.runner) {
            builder
                .setQueryRunner(data.runner)
                .useTransaction(true)
                .setLock('pessimistic_write');
        }

        if(data?.select?.length) {
            for(let field of data.select) {
                builder.addSelect(`u.${field}`)
            }
        }

        try {
            return await builder.where(where).getOne()
        } catch (e) {
            throw e
        }

    }

    public async index(): Promise<User[] | never> {

        try {
            const builder = this.repository.createQueryBuilder('u')
            return await builder.where({}).getMany()
        } catch (e) {
            throw e
        }
    }

    public async create(dto: CreateUserDTO): Promise<User | never> {

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

    public async update(where: FindOptionsWhere<User>, dto: Partial<User>) {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {

            const getOnePayload: GetOne<any> = {
                filter: where,
                runner
            }

            const item = await this.getOne(getOnePayload) as User

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
                throw new NotFoundException('User not found');
            }

            return this.repository.merge(item, returned);
        } catch (e: any) {
            await runner.rollbackTransaction();
            throw e
        } finally {
            await runner.release();
        }
    }

    public async delete(id: string): Promise<User | never> {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const where: FindOptionsWhere<User> = {id};

            const item = await this.repository
                .createQueryBuilder()
                .setQueryRunner(runner)
                .useTransaction(true)
                .setLock('pessimistic_write')
                .where(where)
                .getOne();

            if (!item) {
                throw new ByIdNotFoundException(User, id);
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
