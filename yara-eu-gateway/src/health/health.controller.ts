import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
    @Inject()
    health: HealthService;

    @Get()
    @HealthCheck()
    check(): Promise<HealthCheckResult> {
        return this.health.check();
    }
}
