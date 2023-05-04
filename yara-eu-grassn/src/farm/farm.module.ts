import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';
import { FarmResolver } from './farm.resolver';
import { FarmService } from './farm.service';
import { Farm } from './farm.entity';

@Module({
    imports: [SequelizeModule.forFeature([Farm]), CommonModule],
    providers: [FarmService, FarmResolver],
    exports: [FarmService]
})
export class FarmModule {}
