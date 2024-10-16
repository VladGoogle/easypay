import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type EntityClassOrSchema = Parameters<typeof InjectRepository>[0];

export class ByEmailNotFoundException extends NotFoundException {
    constructor(
        itemType: string | EntityClassOrSchema,
        email: string,
        ...args: any[]
    ) {
        let name: string;
        if (typeof itemType === 'string') {
            name = itemType;
        } else {
            name = (itemType as any).name;
        }

        const message = `${name} by email = '${email}' not found`;

        super(message, ...args);
    }
}
