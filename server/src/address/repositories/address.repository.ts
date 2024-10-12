import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOptionsWhere, QueryFailedError, Repository} from "typeorm";

import {Address, Admin, User} from "@libs/entities";
import {ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";
import {pgReturning} from "@libs/utils";

import {CreateAddressDTO, UpdateAddressDTO} from "../dto";
import {isObject} from "lodash";

@Injectable()
export class AddressRepository implements RepositoryInterface{


    constructor(@InjectRepository(Address) private readonly repository: Repository<Address>) {
    }

    async getOne(data: GetOne<any>) {

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
                builder.addSelect(field)
            }
        }

        try {
            return await builder.where(where).getOne()
        } catch (e) {
            throw e
        }
    }

    public async index(): Promise<Address[] | never> {

        try {
            const builder = this.repository.createQueryBuilder('a')
            return await builder.where({}).getMany()
        } catch (e) {
            throw e
        }
    }

    public async create(dto: CreateAddressDTO): Promise<Address | any> {

        try {
            const item = this.repository.create(dto);

            await this.repository.save(item);

           return item
        } catch (e) {
            if (e instanceof QueryFailedError) {
                if(e.driverError.code === '23503') {
                    throw new BadRequestException('Foreign key violation')
                }
            }
        }
    }

    public async update(id: string, dto: UpdateAddressDTO) {

        const where: FindOptionsWhere<Address> = {id};

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

            const [returned] = result as [User];

            if (!returned) {
                throw new ByIdNotFoundException(User, id);
            }

            return this.repository.merge(<Address>item, returned);
        } catch (e: any) {
            if(e.code === 404) {
                throw new ByIdNotFoundException(User, id);
            }

            throw e
        }
    }

    public async delete(id: string): Promise<Address | never> {

        const runner = this.repository.manager.connection.createQueryRunner();

        await runner.connect();
        await runner.startTransaction();

        try {
            const where: FindOptionsWhere<Address> = {id};

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
