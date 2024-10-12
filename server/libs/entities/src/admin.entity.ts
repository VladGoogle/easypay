import {Column, Entity} from 'typeorm';
import { Model } from './base/model.entity.base';

@Entity('admins')
export class Admin extends Model {
    @Column({
        type: 'text',
        unique: true
    })
    email!: string;

    @Column({
        name: 'first_name',
    })
    firstName!: string;

    @Column({
        name: 'last_name',
    })
    lastName!: string;

    @Column({
        name: 'full_name',
        insert: false,
        update: false,
    })
    fullName?: string;

    @Column({
        select: false,
        type: 'text',
    })
    password!: string;
}
