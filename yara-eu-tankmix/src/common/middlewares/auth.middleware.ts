import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    private readonly userAuthorizationList: string[];

    use(req: Request, res: Response, next: NextFunction): void {
        if (
            /\b(__ApolloGetServiceDefinition__)\b/.test(req.body['query']) ||
            /\b(IntrospectionQuery)\b/.test(req.body['query']) ||
            /\b(getFederationInfo)\b/.test(req.body['query']) ||
            req.method === 'GET'
        ) {
            next();
        } else {
            // We can add some additional checks here if needed?
            next();
        }
    }
}
