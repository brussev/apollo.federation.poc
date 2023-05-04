import { join } from 'path';
import { hostname } from 'os';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';
import GraphQLJSON from 'graphql-type-json';
import { AuthenticationMiddleware } from './common/middlewares/auth.middleware';
import { HealthModule } from './health/health.module';
import { EnvService, NodeEnvs } from './common/env.service';
import { CommonModule } from './common/common.module';
import { ProductModule } from './products/product.module';

@Module({
    imports: [
        CommonModule,
        HealthModule,
        ProductModule,
        GraphQLFederationModule.forRootAsync({
            inject: [EnvService],
            useFactory(env: EnvService) {
                let enablePlayground = env.get('NODE_ENV') !== NodeEnvs.Production;
                const generateSchema = env.get('NODE_ENV') === NodeEnvs.Development;

                if (env.get('ENABLE_GRAPHQL_PLAYGROUND')) {
                    enablePlayground = true;
                }

                return {
                    autoSchemaFile: generateSchema ? join(process.cwd(), 'schema.gql') : true,
                    playground: enablePlayground,
                    path: '/',
                    introspection: enablePlayground,
                    resolvers: { JSON: GraphQLJSON },
                    context: ({ req, connection }) => {
                        return connection ? { req: connection.context } : { req };
                    },
                    buildSchemaOptions: {
                        orphanedTypes: []
                    },
                    fieldResolverEnhancers: ['interceptors', 'guards']
                };
            }
        }),
        LoggerModule.forRootAsync({
            inject: [EnvService],
            useFactory(env: EnvService) {
                return {
                    pinoHttp: {
                        level: env.get('NODE_ENV') === 'production' ? 'info' : 'debug',
                        transport: env.get('isDev')
                            ? {
                                  target: 'pino-pretty',
                                  options: {
                                      colorize: true,
                                      destination: 1,
                                      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                                      sync: env.get('isTest') ? true : false
                                  }
                              }
                            : undefined,
                        timestamp: stdTimeFunctions.isoTime,
                        base: ![NodeEnvs.Development, NodeEnvs.Test].includes(env.get('NODE_ENV'))
                            ? {
                                  pid: process.pid,
                                  hostname: hostname(),
                                  environment: env.get('NODE_ENV'),
                                  app: 'tankmix',
                                  product: 'yara europe'
                              }
                            : undefined,
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
export class AppModule {}
