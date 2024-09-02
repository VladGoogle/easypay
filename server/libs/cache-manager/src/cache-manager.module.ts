import {Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { RedisConfigModule, RedisConfigService } from '@libs/config';

import { CacheManagerService } from './cache-manager.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [RedisConfigModule],
            inject: [RedisConfigService],
            isGlobal: true,
            useFactory: async (config: RedisConfigService) => ({
                return: {
                    ...config.connForCaches,
                },
            }),
        }),
    ],
    providers: [CacheManagerService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}
