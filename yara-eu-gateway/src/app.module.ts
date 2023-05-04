import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, RequestMethod } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { CommonModule } from '@common/common.module';
import { EnvService, NodeEnvs } from '@common/env.service';
import { AuthenticationMiddleware } from '@common/middlewares/auth.middleware';
import { GatewayHelperService } from '@common/utils/gateway-helper';
import { HealthModule } from '@health/health.module';

@Module({
    imports: [
        CommonModule,
        HealthModule,
        GraphQLGatewayModule.forRootAsync({
            imports: [],
            inject: [EnvService, GatewayHelperService, GATEWAY_BUILD_SERVICE],
            useFactory: async (env: EnvService, gatewayHelper: GatewayHelperService) => {
                return {
                    gateway: {
                        ...(env.get('NODE_ENV') === NodeEnvs.Development && {
                            experimental_updateServiceDefinitions: async () => {
                                return {
                                    isNewSchema: true,
                                    serviceDefinitions: await gatewayHelper.getServiceDefinitions()
                                };
                            }
                        })
                    },
                    server: {
                        playground: gatewayHelper.enablePlayground(),
                        path: '/',
                        introspection: gatewayHelper.enablePlayground(),
                        subscriptions: false,
                        tracing: env.get('NODE_ENV') !== NodeEnvs.Production,
                        apollo: {
                            key: env.get('APOLLO_KEY'),
                            graphRef: env.get('APOLLO_GRAPH_REF')
                        },
                        // validationRules: Here we can apply the depth limit I was talking about,
                        plugins: gatewayHelper.getPlugins(),
                        context: gatewayHelper.getContext
                    }
                };
            }
        }),
        LoggerModule.forRootAsync({
            inject: [EnvService],
            useFactory(env: EnvService) {
                return {
                    pinoHttp: {
                        level: env.get('NODE_ENV') === NodeEnvs.Production ? 'info' : 'debug',
                        prettyPrint: env.get('NODE_ENV') !== NodeEnvs.Production,
                        autoLogging: false,
                        formatters: {
                            level: (label) => {
                                return { level: label };
                            }
                        }
                    }
                };
            }
        })
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        throw new Error('Method not implemented.');
    }
}
