import {Inject, Injectable} from '@nestjs/common';
import {hash} from "bcrypt";
import {isEmpty, omit} from "lodash";
import {DeepPartial, FindOptionsWhere} from "typeorm";
import {v7 as uuidv7} from "uuid";

import {User} from "@libs/entities";
import {BodyIsEmptyException, ByIdNotFoundException} from "@libs/exceptions";
import {RepositoryInterface} from "@libs/interfaces/repository";


import {USER_INTERFACE_TOKEN} from "./constants";
import {CreateUserDTO, UpdateUserDTO} from "./dto";


@Injectable()
export class UsersService {

    constructor(@Inject(USER_INTERFACE_TOKEN) private readonly repository: RepositoryInterface) {}

    public async getOne(id: string): Promise<User> {
        const res = await this.repository.getOne(id)

        if (!res) {
            throw new ByIdNotFoundException(User, id);
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

        return omit(await this.repository.create(data), 'password') as Omit<User, 'password'>
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
