import {QueryRunner} from "typeorm";

export interface GetOne<T> {
    filter: T,
    runner?: QueryRunner,
    select?: string[]
}