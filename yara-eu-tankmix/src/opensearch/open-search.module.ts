import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { OpenSearchService } from './open-search.service';

@Module({
    imports: [CommonModule],
    providers: [OpenSearchService],
    exports: [OpenSearchService]
})
export class OpenSearchModule {}
