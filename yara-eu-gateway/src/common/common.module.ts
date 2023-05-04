import { Global, Module } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE } from '@nestjs/graphql';
import { EnvService } from './env.service';
import { GatewayHelperService } from './utils/gateway-helper';

@Global()
@Module({
    providers: [
        EnvService,
        GatewayHelperService,
        {
            provide: GATEWAY_BUILD_SERVICE,
            useFactory: (gatewayHelper: GatewayHelperService) => {
                return gatewayHelper.getServiceBuilder();
            },
            inject: [GatewayHelperService]
        }
    ],
    exports: [EnvService, GatewayHelperService, GATEWAY_BUILD_SERVICE]
})
export class CommonModule {}
