import {BadRequestException} from "@nestjs/common";

export class BodyIsEmptyException extends BadRequestException {
    constructor(...args: any[]) {
        const message = 'Body is empty';
        super(message, ...args);
    }
}