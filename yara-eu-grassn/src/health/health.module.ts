import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../common/common.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
    imports: [CommonModule, TerminusModule],
    controllers: [HealthController],
    providers: [HealthService],
    exports: [HealthService]
})
export class HealthModule {}
