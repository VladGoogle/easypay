import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

type EntityClassOrSchema = Parameters<typeof InjectRepository>[0];

export class CustomNotFoundException extends NotFoundException {
  constructor(itemType: string | EntityClassOrSchema, ...args: any[]) {
    let name: string = typeof itemType;
    if (typeof itemType === 'string') {
      name = itemType;
    } else {
      name = (itemType as any).name;
    }

    const message = `${name} not found`;

    super(message, ...args);
  }
}
