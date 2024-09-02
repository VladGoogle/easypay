import {Body, Controller, Post, Headers, Res, Req, UseGuards, Get} from '@nestjs/common';

import {AuthRequest} from "@libs/interfaces/auth";
import {JwtAccessGuard} from "@libs/guards/jwt";

import {SumsubService} from "./sumsub.service";

@Controller('sumsub')
export class SumsubController {

    constructor(private readonly service: SumsubService) {
    }

    @Post('webhook')
    async handleWebhook(
        @Body() payload: any,
        @Headers('X-Signature') signature: string,  // Assuming the webhook includes a signature header
        @Res() res: Response,
    ) {
        console.log('Webhook received:', payload);
        console.log('Signature:', signature);

        await this.service.handleEvent(payload)
    }

    @UseGuards(JwtAccessGuard)
    @Get('start-kyc')
    async startKycProcess(@Req() { user }: AuthRequest) {
        const {id} = user

        return await this.service.startKycFlow(id)
    }
}
