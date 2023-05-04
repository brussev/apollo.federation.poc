import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';
import { FertilizationResolver } from './fertilization.resolver';
import { FertilizationService } from './fertilization.service';
import { Fertilization } from './fertilization.entity';

@Module({
    imports: [SequelizeModule.forFeature([Fertilization]), CommonModule],
    providers: [FertilizationService, FertilizationResolver],
    exports: [FertilizationService]
})
export class FertilizationModule {}
