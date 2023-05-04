import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client, RequestParams } from '@elastic/elasticsearch';

@Injectable()
export class OpenSearchService {
    private readonly client: Client;

    constructor() {
        this.client = new Client({
            node: 'http://elasticsearch:9200',
            maxRetries: 5,
            requestTimeout: 3000
        });

        this.client.cluster.health({}, async (err, { statusCode }) => {
            // TODO introduce logger?
            console.log(`-- ElasticSearch Client Health -- ${statusCode} --`);
            console.log(`-- ERROR -- ${err?.message || 'No issues found'} --`);
        });
    }

    // find all
    // find one
    // see the filters implemented in eu-incubator
}
