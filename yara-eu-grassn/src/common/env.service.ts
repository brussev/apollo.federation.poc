import { Injectable } from '@nestjs/common';
import { cleanEnv, CleanEnv, port, str, bool } from 'envalid';

export enum NodeEnvs {
    Production = 'production',
    Test = 'test',
    Development = 'development',
    Int = 'int'
}

interface Environment extends CleanEnv {
    NODE_ENV: NodeEnvs;
    PORT: number;
    ENABLE_GRAPHQL_PLAYGROUND: boolean;
    ELASTIC_SEARCH_URL: string;
    BUILD_SCHEMAS: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_PORT: string;
    POSTGRES_HOST: string;
}

@Injectable()
export class EnvService {
    private readonly envConfig: Environment;

    constructor() {
        this.envConfig = cleanEnv<{
            [K in Exclude<keyof Environment, keyof CleanEnv>]: Environment[K];
        }>(process.env, {
            NODE_ENV: str({
                devDefault: NodeEnvs.Development,
                choices: [NodeEnvs.Development, NodeEnvs.Test, NodeEnvs.Production, NodeEnvs.Int]
            }),
            POSTGRES_DB: str({ devDefault: 'PolarisAxial' }),
            POSTGRES_USER: str({ devDefault: 'polaris' }),
            POSTGRES_PASSWORD: str({ devDefault: 'Password83' }),
            POSTGRES_PORT: str({ devDefault: '5432' }),
            POSTGRES_HOST: str({ devDefault: 'polaris.axial.database' }),
            PORT: port({ devDefault: 4000 }),
            ENABLE_GRAPHQL_PLAYGROUND: bool({ default: false, devDefault: true }),
            ELASTIC_SEARCH_URL: str({
                devDefault: 'http://elasticsearch:9200'
            }),
            BUILD_SCHEMAS: str({
                devDefault: 'true',
                default: 'false'
            })
        });
    }

    public get<K extends keyof Environment>(key: K): Environment[K] {
        return this.envConfig[key];
    }
}
