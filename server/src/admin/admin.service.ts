import {Inject, Injectable} from '@nestjs/common';
import {hash} from "bcrypt";
import {isEmpty, omit} from "lodash";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

import {ADMIN_REPOSITORY_TOKEN} from "@libs/constants";
import {Admin} from "@libs/entities";
import {BodyIsEmptyException, ByIdNotFoundException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";

import {CreateAdminDTO, UpdateAdminDTO} from "./dto";

@Injectable()
export class AdminService {

    constructor(@Inject(ADMIN_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<Admin> {

        const filter: FindOptionsWhere<Admin> = {
            id
        }

        const data: GetOne<FindOptionsWhere<Admin>> = {
            filter
        }

        const res = await this.repository.getOne(data)

        if (!res) {
            throw new ByIdNotFoundException(Admin, id);
        }

        return res
    }

    public async index(): Promise<Admin[]> {
        return await this.repository.index()
    }

    public async create(dto: CreateAdminDTO): Promise<Omit<Admin, 'password'>> {
        const password = await hash(dto.password, 10);

        const data: DeepPartial<Admin> = {
            ...dto,
            id: uuidv7(),
            password,
        };

        return omit(await this.repository.create(data), 'password') as Omit<Admin, 'password'>
    }

    public async update(id: string, dto: UpdateAdminDTO): Promise<Admin> {

        const where: FindOptionsWhere<Admin> = {id}
        const update: Partial<Admin> = dto;

        if (isEmpty(update)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(where, update)
    }

    public async delete(id: string): Promise<Admin> {
        return this.repository.delete(id)
    }
}
