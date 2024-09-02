
export interface RepositoryInterface {
    getOne(filter: any): any

    index(): any

    create(dto: any): any

    update(where: any, update: any): any

    delete(id: string): any
}