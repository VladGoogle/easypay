import {Module} from '@nestjs/common';
import {SocketGateway} from "./socket.gateway";
import {SocketListener} from "@libs/socket/socket.listener";

@Module({
    providers: [SocketGateway, SocketListener],
})
export class SocketModule {}
