import {ObjectLiteral, Repository} from "typeorm";

export function pgReturning(repository: Repository<ObjectLiteral>): string {
    const es = repository.manager.connection.driver.escape;

    const returning = repository.metadata.columns
        .filter((c) => c.isSelect)
        .map((c) => `${es(c.databaseName)} as ${es(c.propertyName)}`)
        .join(', ');

    return returning;
}