import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Here we can check if the cognito token is verified or not
        next();
    }
}
