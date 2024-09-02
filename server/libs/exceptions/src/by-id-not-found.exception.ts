import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

type EntityClassOrSchema = Parameters<typeof InjectRepository>[0];

export class ByIdNotFoundException extends NotFoundException {
    constructor(
        itemType: string | EntityClassOrSchema,
        itemId: string,
        ...args: any[]
    ) {
        let name: string = typeof itemType;
        if (typeof itemType === 'string') {
            name = itemType;
        } else {
            name = (itemType as any).name;
        }

        const message = `${name} by id = '${itemId}' not found`;

        super(message, ...args);
    }
}
