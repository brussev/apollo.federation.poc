import { Module, Global, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EnvService } from './env.service';

@Global()
@Module({
    providers: [EnvService],
    exports: [EnvService]
})
export class CommonModule implements OnModuleInit {
    async onModuleInit(): Promise<void> {
        console.log('We can do smth here if we want to?');
    }
}
