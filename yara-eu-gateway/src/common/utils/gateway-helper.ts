import { GraphQLDataSource, RemoteGraphQLDataSource, ServiceEndpointDefinition } from '@apollo/gateway';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { ApolloServerPlugin, BaseContext } from 'apollo-server-plugin-base';
import { DocumentNode, parse } from 'graphql';
import { gql, request } from 'graphql-request';
import { EnvService, NodeEnvs } from '@common/env.service';
import { services } from '../../../services.json';

export interface GatewayContext {
    jwt?: string;
}

export interface ServiceDefinition {
    typeDefs: DocumentNode;
    name: string;
    url?: string;
}

interface ServiceSdlResponse {
    _service: {
        sdl: string;
    };
}

@Injectable()
export class GatewayHelperService {
    private readonly logger = new Logger(GatewayHelperService.name);

    @Inject()
    env: EnvService;

    getServiceBuilder(): (definition: ServiceEndpointDefinition) => GraphQLDataSource {
        return ({ url }) =>
            new RemoteGraphQLDataSource({
                url
                // willSendRequest() {}   // Here we pass the headers before sending request to downstream child service(s)
            });
    }

    async getServiceDefinitions(): Promise<ServiceDefinition[]> {
        const sdlQuery = gql`
            query __ApolloGetServiceDefinition__ {
                _service {
                    sdl
                }
            }
        `;

        return await Promise.all(
            services
                .map((serviceConfig) => ({
                    name: serviceConfig.name,
                    url: this.env
                        .get('LOCAL_SERVICES')
                        .split(',')
                        .map((x) => x.trim())
                        .includes(serviceConfig.name)
                        ? serviceConfig.localUrl
                        : serviceConfig.stagingUrl // If you dont want to start specific service but it needs the subgraph - get it from dev - keep your local resources
                }))
                .map(async (serviceConfig) => {
                    try {
                        const data = await request<ServiceSdlResponse>(serviceConfig.url, sdlQuery);

                        return {
                            name: serviceConfig.name,
                            url: serviceConfig.url,
                            typeDefs: parse(data._service.sdl)
                        };
                    } catch (error) {
                        this.logger.error(
                            `Error fetching server definitions for service: ${serviceConfig.name} (${serviceConfig.url}) - ${error?.message}`
                        );

                        return null;
                    }
                })
        );
    }

    getPlugins(): ApolloServerPlugin[] {
        return [
            this.enablePlayground()
                ? ApolloServerPluginLandingPageGraphQLPlayground({
                      settings: {
                          'schema.polling.enable': false
                      }
                  })
                : ApolloServerPluginLandingPageDisabled()
        ];
    }

    getContext(ctx: BaseContext): GatewayContext {
        if (/\b(__schema|__type)\b/.test(ctx.req.body.query)) {
            // Used to allow schema get and playground init
            return {};
        } else {
            // Check for tokens and so on
            return {};
        }
    }

    enablePlayground(): boolean {
        return this.env.get('NODE_ENV') !== NodeEnvs.Production;
    }
}
