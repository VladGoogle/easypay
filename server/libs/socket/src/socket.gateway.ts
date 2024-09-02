import {Injectable} from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Room} from 'socket.io-adapter'

import {JwtAuthService} from "@libs/auth";
import {CacheManagerService} from '@libs/cache-manager';
import {AuthRequest} from "@libs/interfaces/auth";
import {SocketEvent} from "@libs/interfaces/socket";

@Injectable()
@WebSocketGateway()
export class SocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{

    constructor(
        private readonly cacheManager: CacheManagerService,
        private readonly jwtService: JwtAuthService,
    ) {}

    @WebSocketServer()
    private server: Server

    public afterInit(server: Server): void {
        server.use(
            async (socket: Socket, next: (error?: Error) => void): Promise<void> => {
                try {
                    const { handshake } = socket as any

                    handshake.user = await this.jwtService.verifyToken(
                        handshake.auth.token,
                    )

                    next();
                } catch (e) {
                    next(new WsException(e as Error));
                }
            },
        );
    }

    async handleConnection(socket: Socket): Promise<void> {
        const {user} = socket.handshake as unknown as AuthRequest

        try {
            const socketId = socket.id;
            console.log(`Connect... socket id: ${socketId}`);
            await this.addSocketId(user.id, socketId);
        } catch (e) {
            throw new WsException(e as Error)
        }
    }

    async handleDisconnect(socket: Socket): Promise<void> {
        const socketId = socket.id;
        console.log(`Disconnect... socket id:`, socketId);

        try {
            await this.removeUserId(socket.id);
        } catch (e) {
            throw new WsException(e as Error)
        }
    }

    // add socketId with userId in cache
    async addSocketId(userId: string, socketId: string): Promise<void> {
        const socketIds = await this.getSocketId(userId);

        try {
            if (socketIds && Array.isArray(socketIds) && socketIds.length) {

                socketIds.push(socketId);

                await this.cacheManager.cache.set(
                    `userId:${userId}`,
                    [...new Set(socketIds)],
                    300000,
                );
            } else {
                await this.cacheManager.cache.set(`userId:${userId}`, [socketId], 300000);
            }


            await this.cacheManager.cache.set(`socketId:${socketId}`, userId, 300000);
        } catch (e) {
            throw new WsException(e as Error)
        }
    }

    // get socketId using userId
    async getSocketId(userId: string | undefined): Promise<string[] | undefined> {
        return this.cacheManager.cache.get(`userId:${userId}`);
    }

    // get userId using socketId
    async getUserId(socketId: string | undefined): Promise<string | undefined> {
        return this.cacheManager.cache.get(`socketId:${socketId}`);
    }

    // Remove socketId from user array OR
    // No active connection then remove userId from cache
    async removeUserId(socketId: string): Promise<string | undefined> {
        const userId = await this.getUserId(socketId);

        const socketIds = await this.getSocketId(userId);

        if (socketIds) {
            const updatedSocketIds = socketIds.filter((id) => id !== socketId);

            if (updatedSocketIds.length > 0) {
                await this.cacheManager.cache.set(
                    `userId:${userId}`,
                    updatedSocketIds,
                    300000,
                );
            } else {
                await this.cacheManager.cache.del(`userId:${userId}`);
            }
        }

        await this.cacheManager.cache.del(`socketId:${socketId}`);

        return userId;
    }

    emitToAll(event: string, data: any) {
        this.server.emit(event, data.message);
    }

    async emit(data: SocketEvent) {

        console.log(data)

        const {name, userId, payload} = data

        const receiverSocketIds = await this.getSocketId(userId) as unknown as Room

        console.log(`Sockets: ${receiverSocketIds}`)

        try {
            this.server.to(receiverSocketIds).emit(name, payload);
        } catch (e) {
            throw new WsException(e as Error)
        }

    }
}
