import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';
import { HarvestResolver } from './harvest.resolver';
import { HarvestService } from './harvest.service';
import { Harvest } from './harvest.entity';

@Module({
    imports: [SequelizeModule.forFeature([Harvest]), CommonModule],
    providers: [HarvestService, HarvestResolver],
    exports: [HarvestService]
})
export class HarvestModule {}
