import { Injectable } from '@nestjs/common';
import { cleanEnv, CleanEnv, port, str } from 'envalid';

export enum NodeEnvs {
    Production = 'production',
    Test = 'test',
    Development = 'development',
    Stage = 'stage',
    Int = 'int'
}

interface Environment extends CleanEnv {
    NODE_ENV: NodeEnvs;
    PORT: number;
    ELASTIC_SEARCH_URL: string;
    APOLLO_KEY: string;
    APOLLO_GRAPH_REF: string;
    LOCAL_SERVICES: string;
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
                choices: [
                    NodeEnvs.Development,
                    NodeEnvs.Test,
                    NodeEnvs.Production,
                    NodeEnvs.Stage,
                    NodeEnvs.Int
                ]
            }),
            PORT: port({ devDefault: 5000 }),
            ELASTIC_SEARCH_URL: str({
                devDefault: 'http://elasticsearch:9200'
            }),
            APOLLO_KEY: str({ devDefault: '' }),
            APOLLO_GRAPH_REF: str({ devDefault: '' }),
            LOCAL_SERVICES: str({ devDefault: '' }),
        });
    }

    public get<K extends keyof Environment>(key: K): Environment[K] {
        return this.envConfig[key];
    }
}
