import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { json } from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { EnvService } from 'src/common/env.service';
import { AppModule } from 'src/app.module';

export async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { cors: true });
    const env = app.get(EnvService);
    const logger = app.get(Logger);
    app.useGlobalPipes(new ValidationPipe());

    app.useLogger(logger);

    app.use(json({ limit: '50mb' }));

    await app.listen(env.get('PORT'));

    logger.log(`Yara Europe Gateway http://localhost:${env.get('PORT')}`);

    process.on('uncaughtException', (error) => {
        logger.error(error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
        logger.error(reason);
        process.exit(1);
    });
}
