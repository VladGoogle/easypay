import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    ValidationError,
} from '@nestjs/common';
import { Response } from 'express';
import { first, values } from 'lodash';

export class ValidationException extends BadRequestException {
    constructor(public validationError: ValidationError) {
        super();
    }
}

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): Response {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        return response.status(422).json({
            statusCode: 422,
            message: first(values(exception.validationError.constraints)),
            error: 'Unprocessable Entity',
        });
    }
}
