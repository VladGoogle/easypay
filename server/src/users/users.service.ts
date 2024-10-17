import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {hash} from "bcrypt";
import {isEmpty} from "lodash";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

import {User} from "@libs/entities";
import {BodyIsEmptyException} from "@libs/exceptions";
import {GetOne, RepositoryInterface} from "@libs/interfaces/repository";


import {USER_REPOSITORY_TOKEN} from "./constants";
import {CreateUserDTO, UpdateUserDTO} from "./dto";


@Injectable()
export class UsersService {

    constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(where: any): Promise<User> {

        const filter: FindOptionsWhere<User> = where

        const data: GetOne<FindOptionsWhere<User>> = {
            filter
        }

        const res = await this.repository.getOne(data)

        if (!res) {
            throw new NotFoundException('User not found')
        }

        return res
    }

    public async index(): Promise<User[]> {
        return await this.repository.index()
    }

    public async create(dto: CreateUserDTO): Promise<Omit<User, 'password'>> {
        const password = await hash(dto.password, 10);

        const data: DeepPartial<User> = {
            ...dto,
            id: uuidv7(),
            password,
        };

        return await this.repository.create(data)
    }

    public async update(id: string, dto: UpdateUserDTO): Promise<User> {

        const where: FindOptionsWhere<User> = {id}
        const update: Partial<User> = dto;

        if (isEmpty(update)) {
            throw new BodyIsEmptyException();
        }

        return this.repository.update(where, update)
    }

    public async delete(id: string): Promise<User> {
        return this.repository.delete(id)
    }
}
