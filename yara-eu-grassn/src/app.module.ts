import { join } from 'path';
import { hostname } from 'os';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';
import { SequelizeModule } from '@nestjs/sequelize';
import GraphQLJSON from 'graphql-type-json';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthenticationMiddleware } from './common/middlewares/auth.middleware';
import { HealthModule } from './health/health.module';
import { EnvService, NodeEnvs } from './common/env.service';
import { CommonModule } from './common/common.module';
import { Organization } from './organization/organization.entity';
import { OrganizationModule } from './organization/organization.module';
import { FarmModule } from './farm/farm.module';
import { HarvestModule } from './harvest/harvest.module';
import { FieldModule } from './field/field.module';
import { FertilizationModule } from './fertilization/fertilization.module';

@Module({
    imports: [
        CommonModule,
        HealthModule,
        OrganizationModule,
        FarmModule,
        HarvestModule,
        FieldModule,
        FertilizationModule,
        SequelizeModule.forRootAsync({
            inject: [EnvService],
            useFactory(env: EnvService) {
                return {
                    dialect: 'postgres',
                    host: env.get('POSTGRES_HOST'),
                    port: parseInt(env.get('POSTGRES_PORT')),
                    database: env.get('POSTGRES_DB'),
                    username: env.get('POSTGRES_USER'),
                    password: env.get('POSTGRES_PASSWORD'),
                    autoLoadModels: false,
                    models: [Organization],
                    synchronize: true,
                    omitNull: true,
                    logging: ['production', 'test'].includes(process.env.NODE_ENV) ? false : console.log
                };
            }
        }),
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
                                  app: 'grass-n',
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
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(AuthenticationMiddleware)
            .exclude({ path: 'health', method: RequestMethod.GET }, { path: 'elasticInit', method: RequestMethod.POST })
            .forRoutes('*');
    }
}
