import {Model} from "@libs/entities/base/model.entity.base";
import {Column, Entity, OneToMany} from "typeorm";
import {Address} from "@libs/entities/address.entity";

@Entity('countries')
export class Country extends Model {
    @Column({
        name: 'name',
        type: 'text',
    })
    name!: string;

    @Column({
        type: 'text',
    })
    code!: string;

    @OneToMany(() => Address, (d) => d.country, {
        cascade: true,
        onDelete: 'SET NULL',
    })
    address?: Address;
}