import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommonModule } from '../common/common.module';
import { FieldResolver } from './field.resolver';
import { FieldService } from './field.service';
import { FarmField } from './field.entity';

@Module({
    imports: [SequelizeModule.forFeature([FarmField]), CommonModule],
    providers: [FieldService, FieldResolver],
    exports: [FieldService]
})
export class FieldModule {}
