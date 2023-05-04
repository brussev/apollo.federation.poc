import { Injectable, Inject } from '@nestjs/common';
import { HealthCheckService, MemoryHealthIndicator, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { EnvService } from 'src/common/env.service';

// 512MB
const MEMORY_LIMIT = 512 * 1024 * 1024;

@Injectable()
export class HealthService {
    @Inject()
    env: EnvService;

    @Inject()
    health: HealthCheckService;

    @Inject()
    mem: MemoryHealthIndicator;

    check(): Promise<HealthCheckResult> {
        return this.health.check([(): Promise<HealthIndicatorResult> => this.mem.checkHeap('heap', MEMORY_LIMIT)]);
    }
}
